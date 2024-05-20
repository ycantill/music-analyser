import { css } from 'lit';

export const guitarStyles = css`

.fretboard {
  margin: 10px 0px 30px 30px;
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  grid-template-rows: repeat(6, 30px);
  position: relative;

  .background {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: navajowhite;
    display: grid;
    grid-template-columns: repeat(13, 1fr);

    .nut {
      background-color: white;
    }

    .frets {
      grid-column-start: 2;
    }
  }

  .frets {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    background: transparent;

    .fret {
      border-right: 6px silver solid;
      position: relative;
      grid-template-rows: repeat(3, 1fr);
      grid-template-columns: 100%;
      display: grid;

      .name {
        position: absolute;
        bottom: -20px;
        text-align: center;
        width: 100%;
        font-size: 12px;
      }
    }
  }

  .markers {
    z-index: 2;
    width: 100%;
    height: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(3, 1fr);

    .marker {
      display: flex;
      justify-content: center;
      align-items: center;

      .dot {
        width: 20px;
        height: 20px;
        background-color: black;
        border-radius: 50%;
      }
    }

    .marker.center.fret-3 {
      grid-column-start: 4;
      grid-row-start: 2;
    }

    .marker.center.fret-5 {
      grid-column-start: 6;
      grid-row-start: 2;
    }

    .marker.center.fret-7 {
      grid-column-start: 8;
      grid-row-start: 2;
    }

    .marker.center.fret-9 {
      grid-column-start: 10;
      grid-row-start: 2;
    }

    .marker.top.fret-12 {
      grid-column-start: 13;
      grid-row-start: 1;
      align-items: flex-end;
      padding-bottom: 5px;
    }

    .marker.bottom.fret-12 {
      grid-column-start: 13;
      grid-row-start: 3;
      align-items: flex-start;
      padding-top: 5px;
    }
  }

  .strings {
    z-index: 3;
    width: 100%;
    height: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(6, 1fr);
    padding-top: 13px;
    background: transparent;

    .string {
      width: 100%;
      background-color: silver;
      height: 2px;
      position: relative;

      .name {
        position: absolute;
        left: -22px;
        top: -7px;
        font-size: 12px;
      }

      .name:hover {
        cursor: pointer;
      }
    }
  }

  .notes {
    z-index: 4;
    width: 100%;
    height: 100%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(6, 1fr);

    .note, .interval {
      position: relative;

      .name {
        position: absolute;
        left: 5px;
        background-color: whitesmoke;
        padding: 5px;
        font-size: 12px;
        border-radius: 3px;
        border: solid 1px black;
        width: auto;
        opacity: 0;
      }
    }

    .tone {
      position: relative;

      .name {
        position: absolute;
        left: 5px;
        background-color: orangered;
        padding: 5px;
        font-size: 12px;
        border-radius: 3px;
        border: solid 1px black;
        width: auto;
        opacity: 1;
        cursor: pointer;
      }
    }

    .scale {
      position: relative;

      .name {
        position: absolute;
        left: 5px;
        background-color: cornflowerblue;
        padding: 5px;
        font-size: 12px;
        border-radius: 3px;
        border: solid 1px black;
        width: auto;
        opacity: 1;
        cursor: pointer;
      }
    }

    .note:hover, .interval:hover {
        cursor: pointer;

        .name {
          opacity: 1;
        }
    }
  }
}
`;