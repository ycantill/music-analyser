import { html } from 'lit';
import '../src/music-analyser.js';

export default {
  title: 'MusicAnalyser',
  component: 'music-analyser',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <music-analyser
      style="--music-analyser-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </music-analyser>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
