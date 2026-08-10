import { NextResponse } from 'next/server';
import { ApplicationService } from '@/services/application.service';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'admissions/documents';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await ApplicationService.uploadToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        name: file.name,
        size: file.size,
      },
    });
  } catch (error: unknown) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { publicId, resourceType, files } = body;

    // Handle batch deletion
    if (files && Array.isArray(files)) {
      const deletionPromises = files.map((file) => {
        if (!file.publicId) return Promise.resolve();
        return cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resourceType || 'auto',
        });
      });

      const results = await Promise.allSettled(deletionPromises);
      const failed = results.filter((r) => r.status === 'rejected');

      if (failed.length > 0) {
        console.error('Some files failed to delete during batch cleanup:', failed);
        return NextResponse.json(
          {
            success: false,
            message: 'Some files could not be deleted',
            failedCount: failed.length,
          },
          { status: 207 }, // Multi-Status
        );
      }

      return NextResponse.json({ success: true, message: 'Files deleted successfully' });
    }

    // Handle single deletion
    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'No publicId or files provided' },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'auto',
    });

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error: unknown) {
    console.error('Cloudinary deletion error:', error);
    return NextResponse.json({ success: false, message: 'File deletion failed' }, { status: 500 });
  }
}
