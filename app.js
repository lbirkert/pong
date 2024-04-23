/* Lucas Birkert - Pong */

/*  ___ ___ ___ ___  */
/* | . | . |   | . | */
/* |  _|___|_|_|_  | */
/* |_|         |___| */

/* https://github.com/lbirkert/pong/tree/main/LICENSE */

/* (c) Copyright 2024 Lucas Birkert, all rights reserved */


const BOARD_W = 600;
const BOARD_H = 400;
const BALL_R = 20 / 2;
const PADDLE_W = 20;
const PADDLE_HR = 100 / 2;

const BALL_MIN_X = BALL_R + PADDLE_W;
const BALL_MAX_X = BOARD_W - BALL_R - PADDLE_W;
const BALL_MIN_Y = BALL_R;
const BALL_MAX_Y = BOARD_H - BALL_R;

let BALL_SPEED = 200;
const BALL_SPEED_RATIO = 0.9;
const PADDLE_SPEED = 300;

const PADDLE_MIN = PADDLE_HR;
const PADDLE_MAX = BOARD_H - PADDLE_HR;

let player_a = 200;
let player_b = 200;

let ball_x;
let ball_y;
let ball_vx;
let ball_vy;

let score_a = 0;
let score_b = 0;

function updatePaddles() {
  paddle_a.style = `top: ${player_a}px`;
  paddle_b.style = `top: ${player_b}px`;
}

function updateBall() {
  ball.style = `left: ${ball_x}px; top: ${ball_y}px`;
}

function updateScores() {
  score_a_el.innerText = score_a;
  score_b_el.innerText = score_b;
}

let prev = 0;
function render(now) {
  const dt = (now - prev) / 1000;
  prev = now;

  game(dt);
  updatePaddles();
  updateBall();

  requestAnimationFrame(render);
}

const keys = {};

function onKeyDown(e) {
  keys[e.key] = true;
}

function onKeyUp(e) {
  delete keys[e.key];
}

function game(dt) {
  if(keys["w"]) player_a -= PADDLE_SPEED * dt;
  if(keys["s"]) player_a += PADDLE_SPEED * dt;
  if(keys["i"]) player_b -= PADDLE_SPEED * dt;
  if(keys["k"]) player_b += PADDLE_SPEED * dt;

  player_a = Math.min(PADDLE_MAX, Math.max(PADDLE_MIN, player_a));
  player_b = Math.min(PADDLE_MAX, Math.max(PADDLE_MIN, player_b));

  ball_x += ball_vx * dt;
  ball_y += ball_vy * dt;

  if(ball_x > BALL_MAX_X || ball_x < BALL_MIN_X) {
    ball_vx *= -1;
    ball_x = Math.min(BALL_MAX_X, Math.max(BALL_MIN_X, ball_x));

    const player = ball_x < BOARD_W / 2;
    const ints = player ? player_a - ball_y : player_b - ball_y;

    if(Math.abs(ints) > PADDLE_HR + BALL_R) {
      if(player) score_b += 1;
      else score_a += 1;
      updateScores();
      reset();

      return;
    }

    ball_vy = -ints / PADDLE_HR * Math.abs(ball_vx) * BALL_SPEED_RATIO;
    normalizeVelocity();
  }

  if(ball_y > BALL_MAX_Y || ball_y < BALL_MIN_Y) {
    ball_vy *= -1;
    ball_y = Math.min(BALL_MAX_Y, Math.max(BALL_MIN_Y, ball_y));
  }

  BALL_SPEED += 10 * dt;
}

function reset() {
  BALL_SPEED = 200;
  ball_x = BOARD_W / 2;
  ball_y = BOARD_H / 2;
  ball_vx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
  ball_vy = 2 * (Math.random() - 0.5) * Math.abs(ball_vx) * BALL_SPEED_RATIO;

  normalizeVelocity();
}

function normalizeVelocity() {
  const len = Math.sqrt(ball_vx * ball_vx + ball_vy * ball_vy) / BALL_SPEED;
  ball_vx /= len;
  ball_vy /= len;
}

reset();

window.addEventListener("keyup", onKeyUp);
window.addEventListener("keydown", onKeyDown);

requestAnimationFrame(render);
