import imageCompression from "browser-image-compression";

/**
 * 이미지 배열을 압축하는 함수
 * @param {File[]} files - 원본 파일 배열
 * @param {number} maxSizeMB - 최대 용량 (MB)
 * @returns {Promise<File[]>} - 압축된 파일 배열
 */
export async function compressImages(files) {
    const compressedFiles = [];

    for (const file of files) {
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            });
            compressedFiles.push(compressed);
        } catch (e) {
            console.error("압축 실패:", e);
            compressedFiles.push(file); // 실패 시 원본 사용
        }
    }
    return compressedFiles;
}
