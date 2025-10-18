import React, {useState} from 'react';
import authService from '../utils/authService';
import {Button} from './Button';
import Label from './Label'

interface FileUploadProps {
    uploadApiUrl: string;
    accept?: string;
    onUploadComplete?: (fileUrl: string, fileName: string) => void;
    directory?: string;
    label?: string;
    onClose?: () => void;
}

export default function FileUpload({
                                       uploadApiUrl,
                                       accept = '*/*',
                                       onUploadComplete,
                                       directory = '',
                                       label = 'Choose File',
                                   }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        setUploading(true);
        setMessage('');
        try {
            const uuid = crypto.randomUUID();
            const savedFile = `${uuid}.${file.name.split('.').pop()}`;
            const jwt =
                authService.getAccessTokenSilently ?
                    await authService.getAccessTokenSilently()
                    : '';
            const res = await fetch(uploadApiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: `${directory}${uuid}.${file.name.split('.').pop()}`,
                    fileType: file.type,
                    action: 'PutObject',
                }),
            });

            if (!res.ok) throw new Error('Failed to get presigned URL');

            const {presignedUrl} = await res.json();

            const upload = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                    'Access-Control-Allow-Origin': '*',
                },
                body: file,
            });

            if (!upload.ok) throw new Error('Failed to upload to S3');

            setMessage('✅ Upload successful!');
            if (onUploadComplete) onUploadComplete(savedFile, presignedUrl);
        } catch (err: any) {
            setMessage(`❌ Upload failed: ${err.message}`);
        }

        setUploading(false);
    };

    // return (
    //     <div className="border rounded-xl shadow-lg">
    //         <div className="flex items-center justify-between px-4">
    //             <Label label={label} htmlFor={'file-upload'} className={'bg-gray-200 dark:bg-gray-700 hover:bg-gray-200/10 dark:hover:bg-gray-700/10 cursor-pointer rounded-l-xl'} />
    //             <input
    //                 id="file-upload"
    //                 type="file"
    //                 accept={accept}
    //                 onChange={handleFileChange}
    //                 className="hidden"
    //             />
    //             <span className="text-gray-400 text-sm truncate">
    //                 {file ? file.name : 'No file selected'}
    //             </span>
    //             <Button
    //                 label={uploading ? 'Uploading...' : 'Upload'}
    //                 disabled={uploading || !file}
    //                 onClick={handleUpload}
    //                 className="px-4 py-2 flex items-end justify-end"
    //                 style="primary"
    //             />
    //         </div>
    //
    //         {message && (
    //             <p className={`text-sm ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
    //                 {message}
    //             </p>
    //         )}
    //     </div>
    // );
    return (
        <div className="w-full space-y-2 mt-2">
            <div className="flex items-center">
                <div
                    className="flex-1 flex items-center rounded-lg bg-white dark:bg-[#293440] text-[#212529] dark:text-[#F8F9FA] border border-gray-700 overflow-hidden cursor-pointer">
                    <Label
                        label={label}
                        htmlFor={'file-upload'}
                        className={'px-4 py-3 bg-[#293440]/10 dark:bg-[#F3F3EF]/20 text-[#212529] dark:text-[#F8F9FA] cursor-pointer hover:bg-[#293440]/20 dark:hover:bg-[#F3F3EF]/10 transition-colors rounded-l-lg'}
                    />

                    {/* The hidden file input is still required */}
                    <input
                        id="file-upload"
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden bg-white dark:bg-[#293440] text-[#212529] dark:text-[#F8F9FA]"
                    />

                    {/* This is the "No file chosen" text part */}
                    <span
                        className="bg-white dark:bg-[#293440] text-[#212529] dark:text-[#F8F9FA] text-sm truncate pl-3 pr-2 flex-2">
                        {file ? file.name : 'No file chosen'}
                    </span>
                    <div className="p-1.5">
                        <Button
                            label={uploading ? 'Uploading...' : 'Upload'}
                            disabled={uploading || !file}
                            onClick={handleUpload}
                            className="px-6 py-1.5 rounded-md whitespace-nowrap"
                            style="primary"
                        />
                    </div>
                </div>

                {/* Your existing Upload button */}

            </div>

            {/* Your existing message logic */}
            {message && (
                <p className={`text-sm ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
