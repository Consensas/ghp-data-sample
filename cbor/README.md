Files from 
https://github.com/SemanticClarity/Pathogen-Vocab/blob/jurisdiction-fhir-mapping/packages/pathogen-schemas/src/__fixtures__/DGCProofOfCovidTest/vcbbs.json


Run with


## Original File

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/pathogen/v1",
    "https://w3id.org/security/bbs/v1"
  ],
  "id": "http://example.org/credentials/",
  "type": [
    "VerifiableCredential"
  ],
  "issuanceDate": "2021-02-04T20:29:37Z",
  "expirationDate": "2021-02-05T20:29:37Z",
  "issuer": "did:example:123",
  "credentialSubject": {
    "type": "DGCProofOfCovidTest",
    "testInformation": {
      "type": "DGCTestInformation",
      "testType": "loinc#LP217198-3",
      "testResult": "POS",
      "testCenter": "Hospital Na Františku Prague",
      "testValidatorId": "test-id",
      "countryOfTestAdminstration": "it"
    },
    "personalInformation": {
      "type": "DGCSubject",
      "familyName": "Schmidt",
      "givenName": "Abdiel",
      "birthDate": "1987-07-07",
      "gender": "F"
    }
  },
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2021-05-16T14:46:22Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "inDe7e2WQkeib6mVQJujqnvAyrAuLkuNKeDodRAhGm+aViRpJFhpPmnazremP9SvVWTX3rE374S9TEeeNShsI6rpoe6RNwVSUDixVsYvny5LRTnB+EIR1FC5s+TSI7/cFtPWj4QNmahPjLrepmIcSQ==",
    "verificationMethod": "did:example:123#key-1"
  }
}
```

## CBOR-LD

Run

    node cbor-test

Result:

<img src="./cborld-base32-qr.png" />

Compression Results

    + CBOR-LD
    json 995
    cborld 474
    cborld-base32 760 760 76.4%
    cborld-base32-qr 407 407 40.9%
