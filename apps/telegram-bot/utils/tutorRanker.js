import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function rankTutorsWithAI(assignment, tutors, maxResults = 8) {
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY not set, skipping AI ranking');
    return tutors.slice(0, maxResults);
  }

  if (tutors.length <= maxResults) {
    return tutors;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const levelCategory = assignment.level?.split(' ')[0]?.toLowerCase() || 'secondary';
    const tutorList = tutors.map((t, i) => {
      const rate = t.hourlyRate?.[levelCategory] || t.hourlyRate?.secondary || 'Not specified';
      return `${i + 1}. Name: ${t.fullName || 'Unknown'} | Type: ${t.tutorType || 'Unknown'} | Experience: ${t.yearsOfExperience || 'Unknown'} years | Education: ${t.highestEducation || 'Unknown'}\n   Rate: ${rate} | Introduction: "${(t.introduction || 'None').substring(0, 300)}" | Teaching Experience: "${(t.teachingExperience || 'None').substring(0, 300)}" | Track Record: "${(t.trackRecord || 'None').substring(0, 200)}"`;
    }).join('\n');

    const tutorTypePref = assignment.preferredTutorTypes?.length > 0
      ? assignment.preferredTutorTypes.join(', ')
      : 'Any';

    const prompt = `You are a tuition agency coordinator in Singapore matching tutors to a tuition assignment.

Assignment Details:
- Level: ${assignment.level}
- Subject: ${assignment.subject}
- Location: ${assignment.location}
- Rate: ${assignment.rate}
- Tutor Type Preference: ${tutorTypePref}
- Frequency: ${assignment.frequency || 'Not specified'}
${assignment.description ? `- Description: ${assignment.description}` : ''}

Candidate Tutors:
${tutorList}

Rank the top ${maxResults} most suitable tutors for this assignment. Consider:
- Relevant teaching experience for this specific subject and level (most important)
- Track record with students and demonstrated results
- Qualifications and education background
- Years of experience (more is generally better)
- Rate reasonableness (tutors charging >$90/hr should be ranked lower unless they are exceptionally qualified)
- Quality and detail of their introduction and teaching approach
- Prefer tutors with more complete profiles over empty ones

Return ONLY a valid JSON array of tutor numbers (1-based) in ranked order, best first. Maximum ${maxResults} entries.
Example: [3, 1, 7, 2, 5, 8, 4, 6]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    const text = response.text.trim();

    // Extract JSON array from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\d,\s]+\]/);
    if (!jsonMatch) {
      console.log('Could not parse Gemini response:', text);
      return tutors.slice(0, maxResults);
    }

    const indices = JSON.parse(jsonMatch[0]);
    const ranked = indices
      .filter(idx => idx >= 1 && idx <= tutors.length)
      .map(idx => tutors[idx - 1])
      .slice(0, maxResults);

    if (ranked.length === 0) {
      console.log('Gemini returned no valid indices, falling back');
      return tutors.slice(0, maxResults);
    }

    console.log(`AI ranked top ${ranked.length} tutors:`, ranked.map(t => t.fullName).join(', '));
    return ranked;

  } catch (error) {
    console.error('Gemini ranking failed, falling back to unranked:', error.message);
    return tutors.slice(0, maxResults);
  }
}

export { rankTutorsWithAI };
