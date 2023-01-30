import { FastifyReply, FastifyRequest } from 'fastify';
import moment from 'moment';
import Server from '../classes/Server';

const validator = {
  text(text?: string, optional = false) {
    return !!text?.length || optional;
  },
  email(email: string) {
    let emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  },
  date(date: string) {
    return (
      moment(date, 'MM/DD/YYYY').isValid() ||
      moment(date, 'YYYY-MM-DD').isValid()
    );
  },
  year(year: string) {
    const numberYear = Number(year);
    return numberYear > 2021 && numberYear < 2040;
  },
  bool(bool: boolean, mustAgree = false) {
    return typeof bool === 'boolean' || (mustAgree && bool === true)
      ? true
      : false;
  },
};

type attendeeApplication = {
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

  const appBody = req.body as attendeeApplication;

  // Validate
  if (!validator.text(appBody.firstName))
    return res.status(400).send({ error: 'invalidFirstName' });
  if (!validator.text(appBody.lastName))
    return res.status(400).send({ error: 'invalidLastName' });
  if (!validator.email(appBody.email))
    return res.status(400).send({ error: 'invalidEmail' });
  if (!validator.text(appBody.pronouns))
    return res.status(400).send({ error: 'invalidPronouns' });
  if (!validator.text(appBody.phoneNumber))
    return res.status(400).send({ error: 'invalidPhoneNumber' });
  if (!validator.date(appBody.birthDate))
    return res.status(400).send({ error: 'invalidBirthDate' });
  if (!validator.text(appBody.school))
    return res.status(400).send({ error: 'invalidSchool' });
  if (!validator.year(appBody.gradYear))
    return res.status(400).send({ error: 'invalidGradYear' });
  if (!validator.bool(appBody.wantTeam))
    return res.status(400).send({ error: 'invalidWantTeam' });
  if (!validator.bool(appBody.hasTeam))
    return res.status(400).send({ error: 'invalidHasTeam' });
  if (!validator.text(appBody.teamMembers, true))
    return res.status(400).send({ error: 'invalidTeamMembers' });
  if (!validator.bool(appBody.hasCodingExperience))
    return res.status(400).send({ error: 'invalidCodingExperience' });
  if (!validator.bool(appBody.participatedBefore))
    return res.status(400).send({ error: 'invalidParticipatedBefore' });
  if (!validator.text(appBody.shirtSize))
    return res.status(400).send({ error: 'invalidShirtSize' });
  if (!validator.text(appBody.allergies, true))
    return res.status(400).send({ error: 'invalidAllergies' });
  if (!validator.text(appBody.comments, true))
    return res.status(400).send({ error: 'invalidComments' });
  if (!validator.bool(appBody.understandApplication, true))
    return res.status(400).send({ error: 'invalidUnderstandApplication' });

  await server.database.createParticipantApplication({
    firstName: appBody.firstName,
    lastName: appBody.lastName,
    email: appBody.email,
    pronouns: appBody.pronouns,
    phoneNumber: appBody.phoneNumber,
    birthDate: appBody.birthDate,
    school: appBody.school,
    gradYear: appBody.gradYear,
    wantTeam: appBody.wantTeam,
    hasTeam: appBody.hasTeam,
    teamMembers: appBody.teamMembers,
    hasCodingExperience: appBody.hasCodingExperience,
    participatedBefore: appBody.participatedBefore,
    shirtSize: appBody.shirtSize,
    allergies: appBody.allergies,
    comments: appBody.comments,
  });

  return res.send({ message: 'createdApplication' });
};
