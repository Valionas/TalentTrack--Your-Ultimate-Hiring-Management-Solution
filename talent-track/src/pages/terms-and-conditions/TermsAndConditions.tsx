import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const TermsAndConditions: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 1200 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Welcome to TalentTrack! These terms and conditions outline the rules
            and regulations for the use of TalentTrack's website.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            By accessing this website, we assume you accept these terms and
            conditions in full. Do not continue to use TalentTrack if you do not
            agree to all of the terms and conditions stated on this page.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice, and all Agreements:
            "Client", "You" and "Your" refers to you, the person accessing this
            website and accepting the Company’s terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to our Company.
            "Party", "Parties", or "Us", refers to both the Client and
            ourselves.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            All terms refer to the offer, acceptance, and consideration of
            payment necessary to undertake the process of our assistance to the
            Client in the most appropriate manner, for the express purpose of
            meeting the Client’s needs in respect of provision of the Company’s
            stated services, in accordance with and subject to the prevailing
            law of Bulgaria. Any use of the above terminology or other words in
            the singular, plural, capitalization and/or he/she or they, are
            taken as interchangeable and therefore as referring to the same.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Cookies: We employ the use of cookies. By using TalentTrack's
            website, you consent to the use of cookies in accordance with
            TalentTrack’s privacy policy. Most of the modern-day interactive
            websites use cookies to enable us to retrieve user details for each
            visit. Cookies are used in some areas of our site to enable the
            functionality of this area and ease of use for those people
            visiting. Some of our affiliate/advertising partners may also use
            cookies.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            License: Unless otherwise stated, TalentTrack and/or its licensors
            own the intellectual property rights for all material on
            TalentTrack. All intellectual property rights are reserved. You may
            view and/or print pages from http://www.talenttrack.com for your own
            personal use subject to restrictions set in these terms and
            conditions.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You must not:
            <ul>
              <li>Republish material from http://www.talenttrack.com</li>
              <li>
                Sell, rent or sub-license material from
                http://www.talenttrack.com
              </li>
              <li>
                Reproduce, duplicate or copy material from
                http://www.talenttrack.com
              </li>
              <li>
                Redistribute content from TalentTrack (unless content is
                specifically made for redistribution)
              </li>
            </ul>
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            User Comments: This Agreement shall begin on the date hereof.
            Certain parts of this website offer the opportunity for users to
            post and exchange opinions, information, material, and data
            ('Comments') in areas of the website. TalentTrack does not screen,
            edit, publish or review Comments prior to their appearance on the
            website and Comments do not reflect the views or opinions of
            TalentTrack, its agents, or affiliates. Comments reflect the view
            and opinion of the person who posts such view or opinion. To the
            extent permitted by applicable laws TalentTrack shall not be
            responsible or liable for the Comments or for any loss cost,
            liability, damages, or expenses caused and or suffered as a result
            of any use of and/or posting of and/or appearance of the Comments on
            this website.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            TalentTrack reserves the right to monitor all Comments and to remove
            any Comments which it considers in its absolute discretion to be
            inappropriate, offensive or otherwise in breach of these Terms and
            Conditions.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TermsAndConditions;
