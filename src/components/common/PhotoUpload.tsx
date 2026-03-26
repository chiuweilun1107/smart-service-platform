import React, { type ChangeEvent, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
    onChange: (files: File[]) => void;
    photos?: File[]; // Controlled value
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onChange, photos = [] }) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const updatedFiles = [...photos, ...newFiles];
            onChange(updatedFiles);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        const updatedFiles = photos.filter((_, i) => i !== index);
        onChange(updatedFiles);

        // Cleanup object URL
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previews.map((src, index) => (
                    <div key={index} className="relative aspect-square group">
                        <img
                            src={src}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg border border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-primary-500 hover:bg-slate-50 transition-colors">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 font-medium">上傳照片</span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            {photos.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded">
                    <ImageIcon size={16} />
                    <span>尚未選擇照片 (選填，但建議上傳以利案件處理)</span>
                </div>
            )}
        </div>
    );
};
