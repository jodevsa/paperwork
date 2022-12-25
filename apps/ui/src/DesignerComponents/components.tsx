import text from './Text';
import ImageComponent from './Image';
import Rectangle from './Rectangle';

const components = [Rectangle, text, ImageComponent];
export default components;

export function getDesignerComponent(type:String) {
  return components.find((it) => it.type === type);
}
