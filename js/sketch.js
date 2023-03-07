let img, sound;

class hornSound extends Tone.Oscillator {
  constructor() {
    super({
      type: "triangle",
      frequency: 880,
      volume: -20
    });

   
    this.envelope = new Tone.AmplitudeEnvelope({
      attack: 0.05,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5
    }).toDestination();

    this.lfo = new Tone.LFO({
      type: "sine",
      frequency: 2,
      amplitude: 0.5
    }).start();

    this.filter = new Tone.Filter({
      type: "lowpass",
      frequency: 2000,
      Q: 10
    });

    this.reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.4
    }).toDestination();

     
    this.connect(this.envelope);
    this.envelope.connect(this.filter);

    this.filter.connect(this.reverb);
  }

  play() {
    this.envelope.triggerAttack();
    this.lfo.connect(this.filter.frequency);

    
    const secondOscillator = new Tone.Oscillator({
      type: "sawtooth",
      frequency: 440,
      volume: -20
    });

    const secondEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.3,
      sustain: 0.2,
      release: 0.1
    }).toDestination();

 
    secondOscillator.connect(this.filter);
    secondOscillator.connect(secondEnvelope);
    secondEnvelope.connect(this.reverb);

    
    setTimeout(() => {
      secondOscillator.start();
      secondEnvelope.triggerAttack();
    }, 500);

   
    setTimeout(() => {
      this.envelope.triggerRelease();
      this.lfo.disconnect();
      secondEnvelope.triggerRelease();
      secondOscillator.disconnect();
    }, 2000);
  }
}

function preload() {
  img = loadImage('images/lisa.png');
}

function setup() {
  createCanvas(img.width, img.height);
  image(img, 0, 0);

  sound = new hornSound();

  canvas.addEventListener('click', () => {
    sound.play();
  });
}
