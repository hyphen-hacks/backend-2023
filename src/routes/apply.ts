import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import Server from '../classes/Server';

type AttendeeApplication = {
  firstName: string;
  lastName: string;
  email: string;
  pronouns: string;
  phoneNumber: string;
  birthDate: string;
  school: string;
  gradYear: string;
  wantTeam: boolean;
  hasTeam: boolean;
  teamMembers: string;
  hasCodingExperience: boolean;
  participatedBefore: boolean;
  shirtSize: string;
  allergies: string;
  comments: string;
  understandApplication: boolean;
};

export const handleAttendeeApplication = async (
  req: FastifyRequest,
  res: FastifyReply,
  server: Server
) => {
  if (!req.body || typeof req.body !== 'object')
    return res.status(400).send({ error: 'invalidApplicationBody' });

  const appBody = req.body as AttendeeApplication;

  const AttendeeApplicationValidator = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email({ message: 'The email you provided is invalid.' }),
    pronouns: z.string(),
    phoneNumber: z.coerce
      .number({
        invalid_type_error:
          'Invalid phone number. Make sure it only contains numbers! No "+" or "-".',
      })
      .int(),
    birthDate: z.coerce.date(),
    school: z.string(),
    gradYear: z.coerce
      .number()
      .int()
      .gte(2024, {
        message:
          'You must be a current high school student to participate. Check your graduation year!',
      })
      .lte(2027, {
        message:
          'You must be a current high school student to participate. Check your graduation year!',
      }),
    wantTeam: z.boolean(),
    hasTeam: z.boolean(),
    teamMembers: z.string(),
    hasCodingExperience: z.boolean(),
    participatedBefore: z.boolean(),
    shirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']),
    allergies: z.string(),
    comments: z.string(),
  });

  const validatedApplication = AttendeeApplicationValidator.safeParse(appBody);
  if (!validatedApplication.success) {
    const error = `${validatedApplication.error.errors[0].path[0]} - ${validatedApplication.error.errors[0].message}`;
    return res.status(400).send({ error });
  }

  // Add participant application to database
  const createApplication = await server.database
    .createParticipantApplication(validatedApplication.data)
    .catch(console.error);

  if (!createApplication)
    return res
      .status(500)
      .send({ error: 'Failed to create application. Did you already apply?' });

  return res.send({ message: 'createdApplication' });
};
