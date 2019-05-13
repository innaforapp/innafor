async function initRegisterMember() {
    let groups = await getData(`/app/brukere/getMyGroups`);
    groups = await groups.json();

    var pickerDevice = appF7.picker.create({
        inputEl: '#inputGroupInvite',
        cols: [{
            textAlign: 'center',
            values: groups.groups,
        }],
        toolbarCloseText: 'Ferdig',
    });
}
