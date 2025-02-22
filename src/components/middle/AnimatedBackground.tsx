import React, {
  memo, useCallback, useEffect, useRef, useState,
} from '../../lib/teact/teact';

import buildClassName from '../../util/buildClassName';
import { hexToRgba } from '../../util/colors';

import './AnimatedBackground.scss';

type OwnProps = {
  trigger: any;
  colors: string[];
};
type StateProps = {};

interface Light {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  angle: number;
  moveRadius: number;
  gradientRadius: number;
  color: string;
}

function AnimatedBackground({
  trigger,
  colors,
}: OwnProps & StateProps) {
  // eslint-disable-next-line no-null/no-null
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // eslint-disable-next-line no-null/no-null
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [lights, setLights] = useState<Light[]>([]);
  const [initing, setIniting] = useState<boolean>(true);

  const draw = useCallback(() => {
    if (!canvasRef.current || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.globalCompositeOperation = 'screen';

    lights.forEach((light) => {
      const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.gradientRadius);
      gradient.addColorStop(0.1, light.color);
      gradient.addColorStop(1, hexToRgba(light.color, 0));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(light.x, light.y, light.gradientRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [ctx, lights]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current!;
    setCtx(canvas.getContext('2d')!);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current!;
    const l: Light[] = [];

    const addLight = (color: string) => {
      l.push({
        x: 0,
        y: 0,
        baseX: canvas.width / 2,
        baseY: canvas.height / 2,
        angle: 0,
        moveRadius: canvas.width * 0.6,
        gradientRadius: canvas.width * 0.8,
        color,
      });
    };

    colors.map(addLight);

    l.forEach((light, index) => {
      light.angle = ((2 * Math.PI) / l.length) * index;
    });

    setLights(l);
  }, [canvasRef, colors]);

  const updateLights = useCallback((frames: number) => {
    let framesLeft = frames;

    const frame = () => {
      lights.forEach((light) => {
        light.angle += 0.05;

        // make the light oscillate towards/away from the center
        const r = light.moveRadius * (0.3 + 0.7 * Math.abs(Math.sin(light.angle)));
        light.x = light.baseX + Math.cos(light.angle) * r;
        light.y = light.baseY + Math.sin(light.angle) * r;
      });
      draw();

      if (framesLeft-- > 0) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [draw, lights]);

  useEffect(() => {
    updateLights(trigger ? 15 : 0);
    setIniting(false);
  }, [trigger, updateLights]);

  return (
    <canvas ref={canvasRef} className={buildClassName('AnimatedBackground', initing && 'AnimatedBackground__hidden')} />
  );
}

export default memo(AnimatedBackground);
