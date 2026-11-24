import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const regionType = searchParams.get('regionType') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const jobs = await db.getJobs({
      search,
      regionType,
      category,
      status,
      limit
    });

    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.titleHindi || !body.organization || !body.regionType) {
      return NextResponse.json(
        { error: 'शीर्षक (Hindi), संस्था का नाम एवं क्षेत्र प्रकार आवश्यक है।' },
        { status: 400 }
      );
    }

    const created = await db.createJob({
      title: body.title || body.titleHindi,
      titleHindi: body.titleHindi,
      organization: body.organization,
      orgShort: body.orgShort || body.organization.slice(0, 8).toUpperCase(),
      category: body.category || 'government',
      regionType: body.regionType || 'up_state',
      countryOrState: body.countryOrState || 'उत्तर प्रदेश',
      countryCode: body.countryCode,
      totalVacancies: parseInt(body.totalVacancies) || 1,
      qualification: body.qualification || '10+2',
      qualificationHindi: body.qualificationHindi || '12वीं पास',
      ageLimit: body.ageLimit || '18-35 वर्ष',
      salaryRange: body.salaryRange,
      applicationDeadline: body.applicationDeadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: body.status || 'ACTIVE',
      applicationFee: body.applicationFee,
      officialNotificationUrl: body.officialNotificationUrl || '#',
      applyUrl: body.applyUrl || '#',
      featured: Boolean(body.featured),
      description: body.description || body.titleHindi,
      selectionProcess: body.selectionProcess || []
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
