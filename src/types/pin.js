import {Element} from 'chart.js';
import {scaleValue} from '../helpers';

export default class PinAnnotation extends Element {

  inRange(x, y) {
    const {width, options} = this;
    const center = this.getCenterPoint(true);
    const radius = width / 2 + options.borderWidth;

    if (radius <= 0) {
      return false;
    }

    return (Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)) <= Math.pow(radius, 2);
  }

  getCenterPoint(useFinalPosition) {
    const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
    return {x, y};
  }

  draw(ctx, chartArea) {
    const {x, y, options} = this;
    const height = (chartArea.bottom + chartArea.top) / options.pinHeight

    ctx.save();

    ctx.lineWidth = options.pinWidth;
    ctx.strokeStyle = options.borderColor;
    ctx.fillStyle = options.backgroundColor;

    ctx.setLineDash(options.borderDash);
    ctx.lineDashOffset = options.borderDashOffset;
    
    //draw pinhead
    ctx.beginPath();
    ctx.arc(x, height-options.pinRadius, options.pinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // draw line
    ctx.lineWidth = options.borderWidth
    ctx.moveTo(x, height);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();

    ctx.restore();
  }

  resolveElementProperties(chart, options) {
    const {chartArea, scales} = chart;
    const xScale = scales[options.xScaleID];
    const yScale = scales[options.yScaleID];
    let x = chartArea.width / 2;
    let y = chartArea.height / 2;

    if (xScale) {
      x = scaleValue(xScale, options.xValue, x);
    }

    if (yScale) {
      y = scaleValue(yScale, options.yValue, y);
    }
    y = (chartArea.bottom + chartArea.top) / options.pinHeight;
    return {
      x,
      y,
      width: options.radius * 2,
      height: options.radius * 2
    };
  }
}

PinAnnotation.id = 'pinAnnotation';

PinAnnotation.defaults = {
  display: true,
  adjustScaleRange: true,
  borderDash: [],
  borderDashOffset: 0,
  borderWidth: 1,
  radius: 10,
  pinWidth: 0,
  pinRadius: 0,
  pinHeight: 0,
  xScaleID: 'x',
  xValue: undefined,
  yScaleID: 'y',
  yValue: undefined
  
};

PinAnnotation.defaultRoutes = {
  borderColor: 'color',
  backgroundColor: 'color'
};
