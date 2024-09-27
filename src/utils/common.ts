// File转base64
export function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // 路径url转成file文件格式
  export async function convertUrlToFile(imageUrl: string, fileName: string) {
    try {
      // 发起GET请求获取资源，设置responseType为blob
      const response = await fetch(imageUrl, { method: "GET", mode: "cors" });
      // 检查请求是否成功
      if (!response.ok) {
        throw new Error("图片加载失败！");
      }
      // 获取Blob数据
      const blob = await response.blob();
      // 创建File对象
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    } catch (error) {
      console.error("图片url转换Blob失败!", error);
      return null;
    }
  }

// 导出为图片
export function exportImage(dom: any, fileName: string='image') {
    if (!dom) return;
    const link = document.createElement("a");
    link.href = dom.toDataURL();
    link.download =`${fileName}.png`
    link.click();
}