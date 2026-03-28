import MusicAnalyser from './components/MusicAnalyser.jsx';
import ShareButton from './components/ShareButton.jsx';
import './styles/index.css';

const REFERENCES = [
  {
    id: 1,
    type: 'book',
    citation: 'Chase, W. How Music Really Works. Roedy Black Publishing.',
    url: 'https://www.howmusicreallyworks.com',
  },
  {
    id: 2,
    type: 'article',
    citation:
      'Shapira Lots, I. & Stone, L. (2008). Perception of musical consonance and dissonance: an outcome of neural synchronization. J R Soc Interface, 5(29), 1429–1434.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2607353/',
  },
  {
    id: 3,
    type: 'web',
    citation: 'Roos, F. (2020). Pure Intervals. Loophole Letters.',
    url: 'https://loophole-letters.vercel.app/intervals',
  },
];

export default function App() {
  return (
    <>
      <MusicAnalyser />
      <div className="app-toolbar">
        <ShareButton />
      </div>
      <section className="references">
        <h2>Referencias</h2>
        <ol>
          {REFERENCES.map((ref) => (
            <li key={ref.id}>
              {ref.citation}{' '}
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                {ref.url}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
