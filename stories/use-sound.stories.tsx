import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import useSound from '@';

import boopSfx from './boop.mp3';
import fanfareSfx from './fanfare.mp3';
import glugSfx from './glug.mp3';
import dunDunDunSfx from './dun-dun-dun.mp3';

import Button from './Button';
import Wrapper from './Wrapper';

export default {
  title: 'useSound',
  decorators: [withKnobs, storyFn => <Wrapper>{storyFn()}</Wrapper>],
};

export const Simple = () => {
  const [playBoop] = useSound(boopSfx);

  return <Button onClick={playBoop}>Play SFX</Button>;
};

Simple.story = {
  name: 'Default',
};

export const Hovering = () => {
  const [play, { stop }] = useSound(fanfareSfx);

  return (
    <Button onMouseEnter={play} onMouseLeave={stop}>
      <span role="img" aria-label="trumpet">
        🎺
      </span>
    </Button>
  );
};

Hovering.story = {
  name: 'Play when hovering',
};

export const Toggleable = () => {
  const [play, { isPlaying, stop }] = useSound(fanfareSfx);

  return (
    <Button onClick={isPlaying ? stop : play}>
      {isPlaying ? 'Stop' : 'Play'}
    </Button>
  );
};

Toggleable.story = {
  name: 'Toggle start/stop',
};

export const Interrupt = () => {
  const interrupt = boolean('Interrupt', false);

  const [play] = useSound(fanfareSfx, { interrupt });

  return (
    <>
      <Button onClick={play}>Play sound</Button>
      <br />
      <br />
      (Use the "Knobs" tab below to toggle <em>Interrupt</em>)
    </>
  );
};

Interrupt.story = {
  name: 'Interruptible',
};

export const RisingPitch = () => {
  const [pitchMultiple, setPitchMultiple] = React.useState(0.75);
  const isAscending = React.useRef(false);

  const [play] = useSound(glugSfx, {
    playbackRate: pitchMultiple,
    interrupt: true,
  });

  const handleClick = () => {
    if (pitchMultiple < 0.75 || pitchMultiple > 1.5) {
      isAscending.current = !isAscending.current;
    }

    setPitchMultiple(pitchMultiple + 0.1 * (isAscending.current ? 1 : -1));

    play();
  };

  return (
    <Button aria-label="Trigger sound effect" onClick={handleClick}>
      <span role="img" aria-label="yelling person">
        🗣
      </span>
    </Button>
  );
};

RisingPitch.story = {
  name: 'Rising Pitch',
};

export const Sprite = () => {
  const [playSound, { duration }] = useSound(dunDunDunSfx, {
    sprite: {
      first: [0, 321],
      second: [321, 630 - 321],
      third: [660, 2184 - 660],
    },
    interrupt: true,
  });

  React.useEffect(() => {
    const handlePress = ev => {
      switch (ev.key) {
        case '1': {
          return playSound({ id: 'first' });
        }
        case '2': {
          return playSound({ id: 'second' });
        }
        case '3': {
          return playSound({ id: 'third' });
        }
      }
    };

    window.addEventListener('keydown', handlePress);

    return () => {
      window.removeEventListener('keydown', handlePress);
    };
  }, [playSound]);

  return (
    <>
      <Button
        aria-label="first note"
        onClick={() => playSound({ id: 'first' })}
      >
        1
      </Button>
      <Button
        aria-label="second note"
        onClick={() => playSound({ id: 'second' })}
        style={{ margin: '0 24px' }}
      >
        2
      </Button>
      <Button
        aria-label="third note"
        onClick={() => playSound({ id: 'third' })}
      >
        3
      </Button>
    </>
  );
};

Sprite.story = {
  name: 'Sprite',
};