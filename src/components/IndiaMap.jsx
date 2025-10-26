import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';

// Fallback: support various property keys for state name across datasets
const getStateName = (props = {}) =>
  props.NAME_1 || props.state || props.st_nm || props.State_Name || props.STATE_NAME || props.NAME || props.name || '';

const HIGHLIGHT_STATES = new Set(['Uttar Pradesh', 'Uttarakhand', 'Madhya Pradesh']);

const LOCAL_URL = '/data/india-states.json';
const CDN_URL = 'https://cdn.jsdelivr.net/gh/Subhash9325/GeoJson-Data-of-Indian-States/Indian_States.json';
const GITHUB_URL = 'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States.json';

const IndiaMap = ({ className = '' }) => {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Try local copy first for reliability
        const rLocal = await fetch(LOCAL_URL);
        if (rLocal.ok) {
          const dLocal = await rLocal.json();
          if (active) {
            setFeatures(dLocal.features || []);
            setLoading(false);
          }
          return;
        }
        throw new Error('local missing');
      } catch (e1) {
        try {
          const rCdn = await fetch(CDN_URL);
          if (!rCdn.ok) throw new Error('cdn failed');
          const dCdn = await rCdn.json();
          if (active) {
            setFeatures(dCdn.features || []);
            setLoading(false);
          }
        } catch (e2) {
          try {
            const rGh = await fetch(GITHUB_URL);
            if (!rGh.ok) throw new Error('gh failed');
            const dGh = await rGh.json();
            if (active) {
              setFeatures(dGh.features || []);
              setLoading(false);
            }
          } catch (e3) {
            if (active) {
              setError('Failed to load map');
              setLoading(false);
            }
          }
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // Use a fixed logical size; SVG will scale via viewBox
  const width = 640;
  const height = 420;

  const projection = useMemo(() => {
    try {
      // Center on India and fit to features when available
      if (features.length > 0) {
        return geoMercator().fitSize([width, height], { type: 'FeatureCollection', features });
      }
    } catch (e) {}
    return geoMercator().center([78.9629, 22.5937]).scale(900).translate([width / 2, height / 2]);
  }, [features]);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background */}
        <rect x="0" y="0" width={width} height={height} fill="white" />
        {/* States */}
        <g>
          {features.map((f, idx) => {
            const name = getStateName(f.properties);
            const highlighted = HIGHLIGHT_STATES.has(name);
            return (
              <path
                key={idx}
                d={pathGen(f)}
                fill={highlighted ? 'var(--brand-green-600)' : '#e6eff7'}
                stroke={highlighted ? 'var(--brand-green-700)' : '#b5c7da'}
                strokeWidth={highlighted ? 1.2 : 0.8}
              >
                <title>{name}</title>
              </path>
            );
          })}
        </g>
      </svg>
      {loading && features.length === 0 && !error && (
        <div className="text-sm text-gray-500 mt-2">Loading map…</div>
      )}
      {error && (
        <div className="text-sm text-red-600 mt-2">{error}. You can add a local copy at public/data/india-states.json to avoid network issues.</div>
      )}
      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'var(--brand-green-600)' }}></span>
        <span className="text-gray-600">Highlighted: Uttar Pradesh, Uttarakhand, Madhya Pradesh</span>
      </div>
    </div>
  );
};

export default IndiaMap;
