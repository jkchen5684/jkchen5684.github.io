function test() {
    const client = new FHIR.client("https://r3.smarthealthit.org");
    client.request("Patient/2e27c71e-30c8-4ceb-8c1c-5641e066c0a4");
}