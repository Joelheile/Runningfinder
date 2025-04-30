export async function downloadImageAsFile(
  imageUrl: string,
  fileName: string,
): Promise<File> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const blob = new Blob([imageData], { type: contentType });

    return new File([blob], fileName, { type: contentType });
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}
