export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateFile = async (file: File): Promise<FileValidationResult> => {
    // Check file type
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp'
    ];

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Only PDF or image files (JPG, JPEG, PNG, GIF, WEBP, BMP) are allowed'
        };
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        return {
            isValid: false,
            error: 'File size must be less than 5MB'
        };
    }

    // Check if file is damaged/corrupted
    try {
        await checkFileIntegrity(file);
        return { isValid: true };
    } catch {
        return {
            isValid: false,
            error: 'File appears to be damaged or corrupted. Please upload a valid file.'
        };
    }
};

const checkFileIntegrity = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // Basic integrity check - try to read the file
            try {
                if (file.type === 'application/pdf') {
                    // For PDFs, check if we can read some basic data
                    const arrayBuffer = reader.result as ArrayBuffer;
                    if (arrayBuffer.byteLength < 100) {
                        reject(new Error('PDF file appears to be too small or corrupted'));
                        return;
                    }
                } else {
                    // For images, try to create an image element
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error('Image appears to be corrupted'));
                    img.src = URL.createObjectURL(file);
                    return;
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file - it may be damaged'));
        };

        if (file.type === 'application/pdf') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsDataURL(file);
        }

        // Timeout for very large files
        setTimeout(() => {
            reject(new Error('File validation timeout - file may be too large or corrupted'));
        }, 10000);
    });
};