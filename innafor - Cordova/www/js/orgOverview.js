$$(document).on('page:init', '.page[data-name="orgOverview"]', async function (e) {
    console.log("hey")
    let orgs = await getData(`/app/brukere/getOrgs`);
    orgs = await orgs.json();

    console.log(orgs)
});


