import { renderToStaticMarkup } from 'react-dom/server';
import CategoryIcon from '@/components/CategoryIcon';

const html = renderToStaticMarkup(
  <div style={{ position: 'relative', width: 32, height: 42 }}>
    <svg width={32} height={42} viewBox="0 0 32 42">
      <path d="M16 0C7 0 0 7 0 16z" fill="#f97316" stroke="white" strokeWidth={1.5} />
      <circle cx={16} cy={16} r={11.5} fill="white" />
    </svg>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CategoryIcon iconname="briefcase" size={15} color="#f97316" />
    </div>
  </div>
);
console.log(html);
console.log('---');
console.log('contains <svg for icon:', (html.match(/<svg/g) || []).length);
