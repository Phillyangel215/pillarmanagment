import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface AvatarProps {
  url?: string | null
  size?: number
  onUpload?: (event: Event, url: string) => void
  className?: string
  editable?: boolean
}

export default function Avatar({ 
  url, 
  size = 150, 
  onUpload, 
  className = '',
  editable = true 
}: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
      
      if (error) {
        console.log('Error downloading image: ', error.message)
        return
      }

      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = fileName

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Call the onUpload callback
      if (onUpload) {
        onUpload(event as unknown as Event, filePath)
      }

      // Update the avatar URL immediately
      downloadImage(filePath)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const avatarStyle = {
    height: `${size}px`,
    width: `${size}px`,
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div 
        className="relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300"
        style={avatarStyle}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">
            👤
          </div>
        )}
      </div>

      {/* Upload Button */}
      {editable && (
        <div className="flex flex-col items-center">
          <label 
            htmlFor="avatar-upload"
            className={`
              px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer
              hover:bg-blue-600 transition-colors duration-200
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {uploading ? 'Uploading...' : 'Upload Avatar'}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max file size: 5MB
          </p>
        </div>
      )}
    </div>
  )
}
