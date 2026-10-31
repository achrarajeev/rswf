// One place for "who may do what". Pages and stores call can(me, action) instead of checking account types themselves.
// TODO: with a backend this table becomes server-side authorisation (middleware or policy objects). The UI check only hides buttons.
//   account types: User, Institute (self-registered) and Reviewer, Moderator, Admin (staff, invited by an admin)
export const staffRoles = ['Reviewer', 'Moderator', 'Admin']
const grants = {
  'contribute': ['User', 'Institute'],          // join issues, pick up tasks, submit evidence
  'evidence.review': ['Reviewer', 'Admin'],
  'institute.review': ['Reviewer', 'Admin'],
  'credential.review': ['Reviewer', 'Admin'],
  'forum.moderate': ['Moderator', 'Admin'],
  'admin.panel': ['Moderator', 'Admin'],         // tabs inside are filtered again by the actions below
  'users.manage': ['Admin'],
  'audit.view': ['Admin'],
}
export const can = (me, action) => !!me && (grants[action] || []).includes(me.type)
export const isStaff = me => !!me && staffRoles.includes(me.type)
