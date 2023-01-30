"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAttendeeApplication = void 0;
const moment_1 = __importDefault(require("moment"));
const validator = {
    text(text, optional = false) {
        return !!text?.length || optional;
    },
    email(email) {
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(email).toLowerCase());
    },
    date(date) {
        return ((0, moment_1.default)(date, 'MM/DD/YYYY').isValid() ||
            (0, moment_1.default)(date, 'YYYY-MM-DD').isValid());
    },
    year(year) {
        const numberYear = Number(year);
        return numberYear > 2021 && numberYear < 2040;
    },
    bool(bool, mustAgree = false) {
        return typeof bool === 'boolean' || (mustAgree && bool === true)
            ? true
            : false;
    },
};
const handleAttendeeApplication = async (req, res, server) => {
    if (!req.body || typeof req.body !== 'object')
        return res.status(400).send({ error: 'invalidApplicationBody' });
    const appBody = req.body;
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
exports.handleAttendeeApplication = handleAttendeeApplication;
