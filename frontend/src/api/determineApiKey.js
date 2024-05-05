export function determineApiKey(user) {
    const role = user?.organizationMemberships.map(e => e.role) ?? [];
    const admin = role[0] === "org:admin";
    return admin ? 'idkfa' : 'lol';
}