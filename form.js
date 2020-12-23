const axios = require("axios");
var sql = require("mssql");
const cheerio = require("cheerio");
//require("dotenv").config();

const servers = require("./servers");

// config for your database
// var config = {
//   user: process.env.user,
//   password: process.env.password,
//   server: process.env.server,
//   database: process.env.database,
//   stream: false,
//   options: {
//     enableArithAbort: true,
//     encrypt: true
//   },
//   port: 1433,
// };

var config = {
  user: "process.env.user",
  password: "process.env.password",
  server: "process.env.server",
  database: "process.env.database",
  stream: false,
  options: {
    enableArithAbort: true,
    encrypt: true,
  },
  port: 1433,
};

var queryPatientInfo =
  " 	select  " +
  " 	 patient.oid    " +
  " 	,person.First													as FirstName " +
  " 	,person.Middle												as MiddleName " +
  " 	,person.Last													as LastName " +
  " 	,person.SSN														as SSN    " +
  " 	,NULLIF(Concat(ProviderPerson.First,ProviderPerson.Last),'')	as ProviderName " +
  " 	,Location.Name													as LocationName " +
  " 	,Patient.ChartID												as ChartNumber " +
  " 	,CONVERT(char(10), patient.DOB,126)			as DOB    " +
  " 	,Case person.Gender     " +
  " 		when 0 then 3 " + //Unknown
  " 		when 1 then 1 " + //Male
  " 		when 2 then 2 " + //Female
  " 	 end															      as GenderID " +
  " 	,Case SocialHistory.MaritalStatus    " +
  " 		when 0 then 9 " + //Unknown
  " 		when 1 then 4 " + //Single
  " 		when 2 then 5 " + //Married
  " 		when 3 then 6 " + //Divorced
  " 		when 4 then 7 " + //Widowed
  " 		when 5 then 9 " + //Other => Unknown
  " 		when 6 then 8 " + //LegallySeparated => Separated
  " 		when 7 then 5 " + //DomesticPartner => Married
  " 	 end															      as MaritalStatusID " +
  " 	,Case patient.Ethnicity    " +
  " 		when 0 then 4755 " + //Unknown
  " 		when 1 then	40 " + //NotHispanic => Not Hispanic or Latino
  " 		when 2 then	43 " + //Hispanic => Hispanic or Latino
  " 		when 3 then	45 " + //Declined => Decline to Specify
  " 		when 4 then	41 " + //Cuban
  " 		when 5 then	42 " + //Mexican
  " 		when 6 then	44 " + //PuertoRican
  " 	 end															as EthnicityID " +
  " 	,Case SocialHistory.SmokingStatus    " +
  " 	    " +
  " 		when 0 then	15 " + //UnknownIfEverSmoked
  " 		when 1 then	10 " + //CurrentEveryDaySmoker
  " 		when 2 then	11 " + //CurrentSomeDaySmoker
  " 		when 3 then	12 " + //FormerSmoker
  " 		when 4 then	13 " + //NeverSmoker
  " 		when 5 then	14 " + //SmokerCurrentStatusUnknown
  " 		when 6 then	17 " + //LightTobaccoSmoker
  " 		when 7 then	16 " + //HeavyTobaccoSmoker
  " 		when 8 then	15 " + //HasNotBeenAddressed => Unknown if ever smoked
  " 	 end															as SmokingStatusID " +
  " 	,Case patient.Race    " +
  " 		when 0		then null " + //Unknown = 0 => null
  " 		when 1		then 50 " + //White = 1
  " 		when 2		then 48 " + //Black(\"Black or African American\") = 2
  " 		when 4		then 46 " + //AmericanIndian(\"American Indian or Alaska Native\") = 4
  " 		when 8		then 47 " + //Asian = 8
  " 		when 16		then 49 " + //PacificIslander(\"Native Hawaiian or Other Pacific Islander\") = 16
  " 		when 32		then 51 " + //Declined(\"Declined To Specify\") = 32
  " 		when 64		then null " + //Other = 64						=> null
  " 		when 128	then null " + //Samoan = 128						=> null
  " 		when 256	then null " + //Akhiok = 256						=> null
  " 		when 512	then null " + //MexicanAmericanIndian = 512		=> null
  " 		when 1024	then null " + //Vietnamese = 1024					=> null
  " 	  end															as RaceID " +
  " 	    " +
  " 	,Case patient.PrefLanguage	    " +
  " 		when 0		then 4561 " + //Unknown
  " 		when 1		then 4562 " + //English
  " 		when 2		then 4563 " + //Spanish
  " 		when 3		then 4569 " + //Chinese
  " 		when 4		then 4574 " + //French
  " 		when 5		then 4575 " + //German
  " 		when 6		then 4564 " + //Albanian
  " 		when 7		then 4565 " + //Arabic
  " 		when 8		then 4566 " + //Afar
  " 		when 9		then 4567 " + //Bengali
  " 		when 10		then 4568 " + //Bosnian
  " 		when 11		then 4570 " + //Croatian
  " 		when 12		then 4571 " + //Czech
  " 		when 13		then 4572 " + //Danish
  " 		when 14		then 4573 " + //Dutch
  " 		when 15		then 4576 " + //Greek
  " 		when 16		then 4577 " + //Hebrew
  " 		when 17		then 4578 " + //Hungarian
  " 		when 18		then 4579 " + //Icelandic
  " 		when 19		then 4580 " + //Indonesian
  " 		when 20		then 4581 " + //Irish
  " 		when 21		then 4582 " + //Italian
  " 		when 22		then 4583 " + //Japanese
  " 		when 23		then 4584 " + //Korean
  " 		when 24		then 4585 " + //Latvian
  " 		when 25		then 4586 " + //Lithuanian
  " 		when 26		then 4587 " + //Luxembourgish
  " 		when 27		then 4588 " + //Macedonian
  " 		when 28		then 4589 " + //Mongolian
  " 		when 29		then 4590 " + //Norwegian
  " 		when 30		then 4591 " + //Persian
  " 		when 31		then 4592 " + //Polish
  " 		when 32		then 4593 " + //Portuguese
  " 		when 33		then 4594 " + //Romanian
  " 		when 34		then 4595 " + //Russian
  " 		when 35		then 4596 " + //Serbian
  " 		when 36		then 4597 " + //Slovak
  " 		when 37		then 4598 " + //Slovenian
  " 		when 38		then 4599 " + //Swedish
  " 		when 39		then 4600 " + //Thai
  " 		when 40		then 4601 " + //Turkish
  " 		when 41		then 4602 " + //Ukrainian
  " 		when 42		then 4603 " + //Vietnamese
  " 		when 43		then 4604 " + //Welsh
  " 		when 44		then 4605 " + //Abkhazian
  " 		when 45		then 4606 " + //Afrikaans
  " 		when 46		then 4607 " + //Akan
  " 		when 47		then 4608 " + //Amharic
  " 		when 48		then 4609 " + //Aragonese
  " 		when 49		then 4610 " + //Armenian
  " 		when 50		then 4611 " + //Assamese
  " 		when 51		then 4612 " + //Avaric
  " 		when 52		then 4613 " + //Avestan
  " 		when 53		then 4614 " + //Aymara
  " 		when 54		then 4615 " + //Azerbaijani
  " 		when 55		then 4616 " + //Bashkir
  " 		when 56		then 4617 " + //Bambara
  " 		when 57		then 4618 " + //Basque
  " 		when 58		then 4619 " + //Belarusian
  " 		when 59		then 4620 " + //Biharilanguages
  " 		when 60		then 4621 " + //Bislama
  " 		when 61		then 4622 " + //Tibetan
  " 		when 62		then 4623 " + //Breton
  " 		when 63		then 4624 " + //Bulgarian
  " 		when 64		then 4625 " + //Burmese
  " 		when 65		then 4626 " + //Catalan
  " 		when 66		then 4627 " + //Chamorro
  " 		when 67		then 4628 " + //Chechen
  " 		when 68		then 4629 " + //ChurchSlavic
  " 		when 69		then 4630 " + //Chuvash
  " 		when 70		then 4631 " + //Cornish
  " 		when 71		then 4632 " + //Corsican
  " 		when 72		then 4633 " + //Cree
  " 		when 73		then 4634 " + //Divehi
  " 		when 74		then 4635 " + //Dzongkha
  " 		when 75		then 4636 " + //Esperanto
  " 		when 76		then 4637 " + //Estonian
  " 		when 77		then 4638 " + //Ewe
  " 		when 78		then 4639 " + //Faroese
  " 		when 79		then 4640 " + //Fijian
  " 		when 80		then 4641 " + //Finnish
  " 		when 81		then 4642 " + //WesternFrisian
  " 		when 82		then 4643 " + //Fulah
  " 		when 83		then 4644 " + //Georgian
  " 		when 84		then 4645 " + //Gaelic
  " 		when 85		then 4646 " + //Galician
  " 		when 86		then 4647 " + //Manx
  " 		when 87		then 4648 " + //GreekModern1453to
  " 		when 88		then 4649 " + //Guarani
  " 		when 89		then 4650 " + //Gujarati
  " 		when 90		then 4651 " + //Haitian
  " 		when 91		then 4652 " + //Hausa
  " 		when 92		then 4653 " + //Herero
  " 		when 93		then 4654 " + //Hindi
  " 		when 94		then 4655 " + //HiriMotu
  " 		when 95		then 4656 " + //Igbo
  " 		when 96		then 4657 " + //Ido
  " 		when 97		then 4658 " + //SichuanYi
  " 		when 98		then 4659 " + //Inuktitut
  " 		when 99		then 4660 " + //Interlingue
  " 		when 100	then 4661 " + //InterlinguaInternationalAuxiliaryLanguageAssociation
  " 		when 101	then 4662 " + //Inupiaq
  " 		when 102	then 4663 " + //Javanese
  " 		when 103	then 4664 " + //Kalaallisut
  " 		when 104	then 4665 " + //Kannada
  " 		when 105	then 4666 " + //Kashmiri
  " 		when 106	then 4667 " + //Kanuri
  " 		when 107	then 4668 " + //Kazakh
  " 		when 108	then 4669 " + //CentralKhmer
  " 		when 109	then 4670 " + //Kikuyu
  " 		when 110	then 4671 " + //Kinyarwanda
  " 		when 111	then 4672 " + //Kirghiz
  " 		when 112	then 4673 " + //Komi
  " 		when 113	then 4674 " + //Kongo
  " 		when 114	then 4675 " + //Kuanyama
  " 		when 115	then 4676 " + //Kurdish
  " 		when 116	then 4677 " + //Lao
  " 		when 117	then 4678 " + //Latin
  " 		when 118	then 4679 " + //Limburgan
  " 		when 119	then 4680 " + //Lingala
  " 		when 120	then 4681 " + //LubatoKatanga
  " 		when 121	then 4682 " + //Ganda
  " 		when 122	then 4683 " + //Marshallese
  " 		when 123	then 4684 " + //Malayalam
  " 		when 124	then 4685 " + //Maori
  " 		when 125	then 4686 " + //Marathi
  " 		when 126	then 4687 " + //Malay
  " 		when 127	then 4688 " + //Malagasy
  " 		when 128	then 4689 " + //Maltese
  " 		when 129	then 4690 " + //Nauru
  " 		when 130	then 4691 " + //Navajo
  " 		when 131	then 4692 " + //NdebeleSouth
  " 		when 132	then 4693 " + //NdebeleNorth
  " 		when 133	then 4694 " + //Ndonga
  " 		when 134	then 4695 " + //Nepali
  " 		when 135	then 4696 " + //BokmålNorwegian
  " 		when 136	then 4697 " + //Chichewa
  " 		when 137	then 4698 " + //Occitanpost1500
  " 		when 138	then 4699 " + //Ojibwa
  " 		when 139	then 4700 " + //Oriya
  " 		when 140	then 4701 " + //Oromo
  " 		when 141	then 4702 " + //Ossetian
  " 		when 142	then 4703 " + //Panjabi
  " 		when 143	then 4704 " + //Pali
  " 		when 144	then 4705 " + //Pushto
  " 		when 145	then 4706 " + //Quechua
  " 		when 146	then 4707 " + //Romansh
  " 		when 147	then 4708 " + //Rundi
  " 		when 148	then 4709 " + //Sango
  " 		when 149	then 4710 " + //Sanskrit
  " 		when 150	then 4711 " + //Sinhala
  " 		when 151	then 4712 " + //NorthernSami
  " 		when 152	then 4713 " + //Samoan
  " 		when 153	then 4714 " + //Shona
  " 		when 154	then 4715 " + //Sindhi
  " 		when 155	then 4716 " + //Somali
  " 		when 156	then 4717 " + //SothoSouthern
  " 		when 157	then 4718 " + //Sardinian
  " 		when 158	then 4719 " + //Swati
  " 		when 159	then 4720 " + //Sundanese
  " 		when 160	then 4721 " + //Swahili
  " 		when 161	then 4722 " + //Tahitian
  " 		when 162	then 4723 " + //Tamil
  " 		when 163	then 4724 " + //Tatar
  " 		when 164	then 4725 " + //Telugu
  " 		when 165	then 4726 " + //Tajik
  " 		when 166	then 4727 " + //Tagalog
  " 		when 167	then 4728 " + //Tigrinya
  " 		when 168	then 4729 " + //TongaTongaIslands
  " 		when 169	then 4730 " + //Tswana
  " 		when 170	then 4731 " + //Tsonga
  " 		when 171	then 4732 " + //Turkmen
  " 		when 172	then 4733 " + //Twi
  " 		when 173	then 4734 " + //Uighur
  " 		when 174	then 4735 " + //Urdu
  " 		when 175	then 4736 " + //Uzbek
  " 		when 176	then 4737 " + //Venda
  " 		when 177	then 4738 " + //Volapük
  " 		when 178	then 4739 " + //Walloon
  " 		when 179	then 4740 " + //Wolof
  " 		when 180	then 4741 " + //Xhosa
  " 		when 181	then 4742 " + //Yiddish
  " 		when 182	then 4743 " + //Yoruba
  " 		when 183	then 4744 " + //Zhuang
  " 		when 184	then 4745 " + //Zulu
  " 		when 185	then 4746 " + //Declined
  " 	    " +
  " 	 end															as PreferredLanguage " +
  " 	,person.Address1												as Address1 " +
  " 	,person.Address2												as Address2 " +
  " 	,person.City													as City    " +
  " 	,Case person.State     " +
  " 		when 	'Alabama'						then	'AL'    " +
  " 		when 	'Alaska'						then	'AK'    " +
  " 		when 	'Arizona'						then	'AZ'    " +
  " 		when 	'Arkansas'						then	'AR'    " +
  " 		when 	'California'					then	'CA'    " +
  " 		when 	'Colorado'						then	'CO'    " +
  " 		when 	'Connecticut'					then	'CT'    " +
  " 		when 	'Delaware'						then	'DE'    " +
  " 		when 	'Florida'						then	'FL'    " +
  " 		when 	'Georgia'						then	'GA'    " +
  " 		when 	'Hawaii'						then	'HI'    " +
  " 		when 	'Idaho'							then	'ID'    " +
  " 		when 	'Illinois'						then	'IL'    " +
  " 		when 	'Indiana'						then	'IN'    " +
  " 		when 	'Iowa'							then	'IA'    " +
  " 		when 	'Kansas'						then	'KS'    " +
  " 		when 	'Kentucky'						then	'KY'    " +
  " 		when 	'Louisiana'						then	'LA'    " +
  " 		when 	'Maine'							then	'ME'    " +
  " 		when 	'Maryland'						then	'MD'    " +
  " 		when 	'Massachusetts'					then	'MA'    " +
  " 		when 	'Michigan'						then	'MI'    " +
  " 		when 	'Minnesota'						then	'MN'    " +
  " 		when 	'Mississippi'					then	'MS'    " +
  " 		when 	'Missouri'						then	'MO'    " +
  " 		when 	'Montana'						then	'MT'    " +
  " 		when 	'Nebraska'						then	'NE'    " +
  " 		when 	'Nevada'						then	'NV'    " +
  " 		when 	'New Hampshire'					then	'NH'    " +
  " 		when 	'New Jersey'					then	'NJ'    " +
  " 		when 	'New Mexico'					then	'NM'    " +
  " 		when 	'New York'						then	'NY'    " +
  " 		when 	'North Carolina'				then	'NC'    " +
  " 		when 	'North Dakota'					then	'ND'    " +
  " 		when 	'Ohio'							then	'OH'    " +
  " 		when 	'Oklahoma'						then	'OK'    " +
  " 		when 	'Oregon'						then	'OR'    " +
  " 		when 	'Pennsylvania'					then	'PA'    " +
  " 		when 	'Rhode Island'					then	'RI'    " +
  " 		when 	'South Carolina'				then	'SC'    " +
  " 		when 	'South Dakota'					then	'SD'    " +
  " 		when 	'Tennessee'						then	'TN'    " +
  " 		when 	'Texas'							then	'TX'    " +
  " 		when 	'Utah'							then	'UT'    " +
  " 		when 	'Vermont'						then	'VT'    " +
  " 		when 	'Virginia'						then	'VA'    " +
  " 		when 	'Washington'					then	'WA'    " +
  " 		when 	'West Virginia'					then	'WV'    " +
  " 		when 	'Wisconsin'						then	'WI'    " +
  " 		when 	'Wyoming'						then	'WY'    " +
  " 		when 	'District of Columbia'			then	'DC'    " +
  " 		else	UPPER(SUBSTRING(person.State, 1, 2))    " +
  " 	 end 														as State    " +
  " 	,RIGHT('00000'+nullif(substring(person.Zip, 1, 5),''), 5)		as ZipCode " +
  " 	,RIGHT('0000'+nullif(substring(person.Zip, 7, 4),''), 4)    	as ZipExt " +
  " 	,person.HomePhone											as PrimaryPhone " +
  " 	,person.MobilePhone											as SecondryPhone " +
  " 	,Person.WorkPhone											as WorkPhone    " +
  " 	,person.Email												as Email    " +
  " 	    " +
  " 	,Insurance.Oid				Insurance_Oid     " +
  " 	,Insurance.PolicyHolder		Insurance_PolicyHolder    " +
  " 	,Case     " +
  " 		when Patient.Oid = Subscriber.Oid then 32 " + //SELF
  " 		when Insurance.Oid is not null and Insurance.PolicyHolder is null then 32 " + //SELF
  " 		when  Patient.Oid <> ISNULL(Subscriber.Oid,Patient.Oid) then     " +
  " 			case (Select top 1 Relationship from DependentRelationship Where DependentRelationship.Guarantor = Subscriber.Oid AND DependentRelationship.Dependent = Patient.Oid )     " +
  " 	           when 0 then 35 " + //Unknown = 0,
  " 	           when 1 then 33 " + //Child = 1,
  " 	           when 2 then 31 " + //Spouse = 2,
  " 	           when 3 then 39 " + //Other = 3,
  " 	           when 4 then 32 " + //Self = 4
  " 	           when 5 then 39 " + //Parent = 5,		=> Other Relationship
  " 	           when 6 then 39 " + //Sibling = 6,		=> Other Relationship
  " 	           when 7 then 39 " + //Friend = 7,		=> Other Relationship
  " 	           when 8 then 39 " + //Guardian = 8,		=> Other Relationship
  " 			end    " +
  " 	    " +
  " 	    " +
  " 	end															as Subscriber_InsuredRelationID    " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.First			else SubscriberPerson.First		end								as Subscriber_FirstName    " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.Middle			else SubscriberPerson.Middle	end								as Subscriber_MiddleName    " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.Last			else SubscriberPerson.Last		end								as Subscriber_LastName    " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.SSN				else SubscriberPerson.SSN		end								as Subscriber_SSN    " +
  " 	,CONVERT(char(10),case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Patient.DOB			else Subscriber.DOB				end,126)		as Subscriber_DOB    " +
  " 	,Case case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.Gender			else SubscriberPerson.Gender		end  " +
  " 		when 0 then 3 " + //Unknown
  " 		when 1 then 1 " + //Male
  " 		when 2 then 2 " + //Female
  " 	 end 														as Subscriber_GenderID " +
  " 	, case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.Address1  else SubscriberPerson.Address1	end as Subscriber_Address1 " +
  " 	, case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.Address2  else SubscriberPerson.Address2	end as Subscriber_Address2 " +
  " 	, case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.City		else SubscriberPerson.City		end as Subscriber_City    " +
  " 	,Case case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.State		else  SubscriberPerson.State end    " +
  " 		when 	'Alabama'						then	'AL'    " +
  " 		when 	'Alaska'						then	'AK'    " +
  " 		when 	'Arizona'						then	'AZ'    " +
  " 		when 	'Arkansas'						then	'AR'    " +
  " 		when 	'California'					then	'CA'    " +
  " 		when 	'Colorado'						then	'CO'    " +
  " 		when 	'Connecticut'					then	'CT'    " +
  " 		when 	'Delaware'						then	'DE'    " +
  " 		when 	'Florida'						then	'FL'    " +
  " 		when 	'Georgia'						then	'GA'    " +
  " 		when 	'Hawaii'						then	'HI'    " +
  " 		when 	'Idaho'							then	'ID'    " +
  " 		when 	'Illinois'						then	'IL'    " +
  " 		when 	'Indiana'						then	'IN'    " +
  " 		when 	'Iowa'							then	'IA'    " +
  " 		when 	'Kansas'						then	'KS'    " +
  " 		when 	'Kentucky'						then	'KY'    " +
  " 		when 	'Louisiana'						then	'LA'    " +
  " 		when 	'Maine'							then	'ME'    " +
  " 		when 	'Maryland'						then	'MD'    " +
  " 		when 	'Massachusetts'					then	'MA'    " +
  " 		when 	'Michigan'						then	'MI'    " +
  " 		when 	'Minnesota'						then	'MN'    " +
  " 		when 	'Mississippi'					then	'MS'    " +
  " 		when 	'Missouri'						then	'MO'    " +
  " 		when 	'Montana'						then	'MT'    " +
  " 		when 	'Nebraska'						then	'NE'    " +
  " 		when 	'Nevada'						then	'NV'    " +
  " 		when 	'New Hampshire'					then	'NH'    " +
  " 		when 	'New Jersey'					then	'NJ'    " +
  " 		when 	'New Mexico'					then	'NM'    " +
  " 		when 	'New York'						then	'NY'    " +
  " 		when 	'North Carolina'				then	'NC'    " +
  " 		when 	'North Dakota'					then	'ND'    " +
  " 		when 	'Ohio'							then	'OH'    " +
  " 		when 	'Oklahoma'						then	'OK'    " +
  " 		when 	'Oregon'						then	'OR'    " +
  " 		when 	'Pennsylvania'					then	'PA'    " +
  " 		when 	'Rhode Island'					then	'RI'    " +
  " 		when 	'South Carolina'				then	'SC'    " +
  " 		when 	'South Dakota'					then	'SD' " +
  " 		when 	'Tennessee'						then	'TN' " +
  " 		when 	'Texas'							then	'TX' " +
  " 		when 	'Utah'							then	'UT' " +
  " 		when 	'Vermont'						then	'VT' " +
  " 		when 	'Virginia'						then	'VA' " +
  " 		when 	'Washington'					then	'WA' " +
  " 		when 	'West Virginia'					then	'WV' " +
  " 		when 	'Wisconsin'						then	'WI' " +
  " 		when 	'Wyoming'						then	'WY' " +
  " 		when 	'District of Columbia'			then	'DC'    " +
  " 		else	UPPER(SUBSTRING(case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.State		else  SubscriberPerson.State end , 1, 2))    " +
  " 	 end														as Subscriber_State " +
  " 	,RIGHT('00000'+nullif(substring(case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.zip	else  SubscriberPerson.zip end, 1, 5),''),5) as Subscriber_ZipCode " +
  " 	,RIGHT('00000'+nullif(substring(case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.zip	else  SubscriberPerson.zip end, 7, 4),''),4) as Subscriber_ZipExt " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.HomePhone else  SubscriberPerson.HomePhone	end				as Subscriber_HomePhone " +
  " 	,case when Insurance.Oid is not null and Insurance.PolicyHolder is null then Person.WorkPhone else  SubscriberPerson.WorkPhone	end				as Subscriber_OfficePhone " +
  " 	,Payer.PayerName							as Subscriber_InsuranceName    " +
  " 	,Case when Payer.PayerName is not null then isnull( Insurance.PolicyID,'000') end 						as Subscriber_InsuranceNumber " +
  " 	,Case     " +
  " 		when Insurance.Oid is not null then 368    " +
  " 	 end										as Subscriber_PayerResponsibilityID " + //Primary
  " 	,CONVERT(char(10),Insurance.StartDate,126)						as Subscriber_CoverageStartDate " +
  " 	,CONVERT(char(10),Insurance.EndDate	,126)							as Subscriber_CoverageEndDate " +
  " 	,Insurance.GroupID							as Subscriber_GroupNumber    " +
  " 	,Insurance.GroupName						as Subscriber_GroupName    " +
  " 	    " +
  " 	    " +
  " 	from patient " +
  " 	LEFT JOIN  person " +
  " 		on person.oid = patient.Oid " +
  " 	LEFT JOIN SocialHistory " +
  " 		on SocialHistory.patient = patient.oid " +
  " 	LEFT JOIN [Provider] " +
  " 		on Provider.Oid = Patient.Provider " +
  " 	Left Join Person as ProviderPerson " +
  " 		on ProviderPerson.oid = Provider.Oid " +
  " 	Left Join Location " +
  " 		on Location.Oid = Patient.AssignedLocation " +
  " 	Left Join Insurance " +
  " 		on Insurance.Oid = Patient.PrimaryInsurance " +
  " 	Left Join Patient Subscriber " +
  " 		on Subscriber.Oid = Insurance.PolicyHolder " +
  " 	Left Join Person SubscriberPerson " +
  " 		on SubscriberPerson.oid = Subscriber.Oid " +
  " 	Left Join Payer " +
  " 		on Payer.Oid = Insurance.Payer " +
  " 	Where patient.ClearPathId = 0	";

function sendForm(form, oid) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "https://pm.clearpathmd.com/Patients/ShortRegistration_Anonymous",
      data: form,

      headers: {
        "Content-Type":
          "multipart/form-data; charset=utf-8; boundary=" + form._boundary,
      },
    })
      .then(function (response) {
        /*var resp = `<div><br>You've successfully registered to our portal.</div>
                <div><br>Your registration id is <b>369284</b>.</div>
                <div><br>Our representative will call you to schedule the appointment.</div>` */

        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

function sqlConn() {
  return new Promise((resolve, reject) => {
    sql.connect(config, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      var request = new sql.Request();
      request.query(queryPatientInfo, function (err, recordset) {
        if (err) {
          console.log(err);
          reject(err);
        }
        sql.close();
        resolve(recordset.recordset);
      });
    });
  });
}

function updateOID(oid, val) {
  return new Promise((resolve, reject) => {
    console.log(oid);
    console.log(val);
    const $ = cheerio.load(val);
    var r = $("b").text();
    var q = "";
    if (r.length > 0 && !isNaN(r)) {
      q =
        "update patient set ClearPathId = " + r + " where oid = '" + oid + "' ";
    } else {
      q = "update patient set ClearPathId = -1 where oid = '" + oid + "' ";
    }
    console.log(q);

    sql.connect(config, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }

      // create Request object
      var request = new sql.Request();

      request.query(q, (err, result) => {
        if (err) {
          console.log(err);
        }

        sql.close();
        resolve();
      });
    });
  });
}

async function querySQLServer() {

    var s = await sqlConn();
    //console.log(s);
    for (var i = 0; i < s.length; i++) {
      await updateOID( s[i].oid,  await sendForm(await FormObjectCreation(s[i]), s[i].oid)  );
    }
  }




function FormObjectCreation(recordset) {
  return new Promise((resolve, reject) => {
    const FormData = require("form-data");
    var form = new FormData();
    form.append("EntityID", 41);
    form.append("CreatedBy", 64);
    //Appending '**test**' in First Name For testing
    //NEED TO REMOVE '**test**' BEFORE GOING TO PRODUCTION.
    if (recordset.FirstName != null)
      form.append("FirstName", "**test**" + String(recordset.FirstName));
    if (recordset.MiddleName != null)
      form.append("MiddleName", String(recordset.MiddleName));
    if (recordset.LastName != null)
      form.append("LastName", String(recordset.LastName));
    if (recordset.SSN != null) form.append("SSN", String(recordset.SSN));
    if (recordset.ProviderName != null)
      form.append("ProviderName", String(recordset.ProviderName));
    if (recordset.LocationName != null)
      form.append("LocationName", String(recordset.LocationName));
    if (recordset.ChartNumber != null)
      form.append("ChartNumber", String(recordset.ChartNumber));
    if (recordset.DOB != null) form.append("DOB", String(recordset.DOB));
    if (recordset.GenderID != null)
      form.append("GenderID", String(recordset.GenderID));
    if (recordset.MaritalStatusID != null)
      form.append("MaritalStatusID", String(recordset.MaritalStatusID));
    if (recordset.EthnicityID != null)
      form.append("EthnicityID", String(recordset.EthnicityID));
    if (recordset.SmokingStatusID != null)
      form.append("SmokingStatusID", String(recordset.SmokingStatusID));
    if (recordset.RaceID != null)
      form.append("RaceID", String(recordset.RaceID));
    if (recordset.PreferredLanguage != null)
      form.append("PreferredLanguage", String(recordset.PreferredLanguage));
    if (recordset.Address1 != null)
      form.append("Address1", String(recordset.Address1));
    if (recordset.Address2 != null)
      form.append("Address2", String(recordset.Address2));
    if (recordset.City != null) form.append("City", String(recordset.City));
    if (recordset.State != null) form.append("State", String(recordset.State));
    if (recordset.State != null) form.append("State", String(recordset.State));
    if (recordset.ZipCode != null)
      form.append("ZipCode", String(recordset.ZipCode));
    if (recordset.ZipExt != null)
      form.append("ZipExt", String(recordset.ZipExt));
    if (recordset.PrimaryPhone != null)
      form.append("PrimaryPhone", String(recordset.PrimaryPhone));
    if (recordset.SecondryPhone != null)
      form.append("SecondryPhone", String(recordset.SecondryPhone));
    if (recordset.WorkPhone != null)
      form.append("WorkPhone", String(recordset.WorkPhone));
    if (recordset.Email != null) form.append("Email", String(recordset.Email));
    if (recordset.Subscriber_InsuredRelationID != null)
      form.append(
        "Subscriber.InsuredRelationID",
        String(recordset.Subscriber_InsuredRelationID)
      );
    if (recordset.Subscriber_FirstName != null)
      form.append(
        "Subscriber.FirstName",
        String(recordset.Subscriber_FirstName)
      );
    if (recordset.Subscriber_MiddleName != null)
      form.append(
        "Subscriber.MiddleName",
        String(recordset.Subscriber_MiddleName)
      );
    if (recordset.Subscriber_LastName != null)
      form.append("Subscriber.LastName", String(recordset.Subscriber_LastName));
    if (recordset.Subscriber_SSN != null)
      form.append("Subscriber.SSN", String(recordset.Subscriber_SSN));
    if (recordset.Subscriber_DOB != null)
      form.append("Subscriber.DOB", String(recordset.Subscriber_DOB));
    if (recordset.Subscriber_GenderID != null)
      form.append("Subscriber.GenderID", String(recordset.Subscriber_GenderID));
    if (recordset.Subscriber_Address1 != null)
      form.append("Subscriber.Address1", String(recordset.Subscriber_Address1));
    if (recordset.Subscriber_Address2 != null)
      form.append("Subscriber.Address2", String(recordset.Subscriber_Address2));
    if (recordset.Subscriber_City != null)
      form.append("Subscriber.City", String(recordset.Subscriber_City));
    if (recordset.Subscriber_State != null)
      form.append("Subscriber.State", String(recordset.Subscriber_State));
    if (recordset.Subscriber_ZipCode != null)
      form.append("Subscriber.ZipCode", String(recordset.Subscriber_ZipCode));
    if (recordset.Subscriber_ZipExt != null)
      form.append("Subscriber.ZipExt", String(recordset.Subscriber_ZipExt));
    if (recordset.Subscriber_HomePhone != null)
      form.append(
        "Subscriber.HomePhone",
        String(recordset.Subscriber_HomePhone)
      );
    if (recordset.Subscriber_OfficePhone != null)
      form.append(
        "Subscriber.OfficePhone",
        String(recordset.Subscriber_OfficePhone)
      );
    if (recordset.Subscriber_InsuranceName != null)
      form.append(
        "Subscriber.InsuranceName",
        String(recordset.Subscriber_InsuranceName)
      );
    if (recordset.Subscriber_InsuranceNumber != null)
      form.append(
        "Subscriber.InsuranceNumber",
        String(recordset.Subscriber_InsuranceNumber)
      );
    if (recordset.Subscriber_PayerResponsibilityID != null)
      form.append(
        "Subscriber.PayerResponsibilityID",
        String(recordset.Subscriber_PayerResponsibilityID)
      );
    if (recordset.Subscriber_CoverageStartDate != null)
      form.append(
        "Subscriber.CoverageStartDate",
        String(recordset.Subscriber_CoverageStartDate)
      );
    if (recordset.Subscriber_CoverageEndDate != null)
      form.append(
        "Subscriber.CoverageEndDate",
        String(recordset.Subscriber_CoverageEndDate)
      );
    if (recordset.Subscriber_GroupNumber != null)
      form.append(
        "Subscriber.GroupNumber",
        String(recordset.Subscriber_GroupNumber)
      );
    if (recordset.Subscriber_GroupName != null)
      form.append(
        "Subscriber.GroupName",
        String(recordset.Subscriber_GroupName)
      );
    resolve(form);
  });
}

function sleepFunction(timeSleep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeSleep);
  });
}

async function infiniteLoop() {
  while (true) {
    var d = new Date();
    console.log(d);
    for (var i = 0; i < servers.length; i++) {
        //console.table(servers[i]);
        config.user = servers[i].user;
        config.password = servers[i].password;
        config.server = servers[i].server;
        config.database = servers[i].database;
        
        console.log(config);
    
        await querySQLServer();
    }
    await sleepFunction(3600000); //every hour
  }
}

console.log("starting");
infiniteLoop();
