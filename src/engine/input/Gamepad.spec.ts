import { Gamepad } from './Gamepad';

describe('Gamepad', () => {
  test('Should response to user input', async () => {
    const gamepad = new Gamepad();
    const faceButton1Code = 0;
    const faceButton2Code = 1;
    const faceButton3Code = 2;

    expect(gamepad.isPressed(faceButton1Code)).toBe(true);
    expect(gamepad.isPressed(faceButton2Code)).toBe(false);
    expect(gamepad.isPressed(faceButton3Code)).toBe(false);
  });
});
