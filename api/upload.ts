export async function uploadImage(file: File): Promise<{ url: string }> {
  // Simulate image upload with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would upload the file to a server and get back a URL.
  // For this mock, we'll use a local object URL.
  const url = URL.createObjectURL(file);
  console.log(`Mock uploaded ${file.name}, URL: ${url}`);
  return { url };
}
