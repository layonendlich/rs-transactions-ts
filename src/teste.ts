interface User {
  birthYear: number
}

function getUsersAge(user: User) {
  return new Date().getFullYear() - user.birthYear
}

getUsersAge({ birthYear: 1988 })
