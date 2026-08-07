import { applicationSchema } from './src/features/application/schemas/application.schema.js';

const mockData = {
  marks: [
    {
      subjectCode: 'ENGLISH',
      subjectName: 'English',
      maximumMarks: '',
      marksSecured: '',
      numberOfChances: '',
    },
    {
      subjectCode: 'PART_II',
      subjectName: 'Part II',
      maximumMarks: '',
      marksSecured: '',
      numberOfChances: '',
    },
  ],
};

const result = applicationSchema.shape.marks.safeParse(mockData.marks);

if (!result.success) {
  console.log('Errors:', JSON.stringify(result.error.issues, null, 2));
} else {
  console.log('Validation passed!');
}
