export function ManejarDatosFoto(imageData: string) {
  const auxPic: Array<string> = imageData.split(",");
  const auxTypeBase: Array<string> = auxPic[0].split(";");

  const allData: any = {
    type: auxTypeBase[0],
    base: auxTypeBase[1],
    pic: auxPic[1]
  };

  return allData;
}

export function armarBase64(imgData: string): string | null {
  return imgData != null ? `data:image/jpeg;base64,${imgData}` : null;
}
