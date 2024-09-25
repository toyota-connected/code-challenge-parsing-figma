
export class TextNode {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  width: number;
  height: number;

  constructor(
    content: string,
    fontSize: number,
    fontFamily: string,
    fontWeight: number,
    lineHeight: number,
    width: number,
    height: number
  ) {
    this.content = content;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
    this.lineHeight = lineHeight;
    this.width = width;
    this.height = height;
  }

}
