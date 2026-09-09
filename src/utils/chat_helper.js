export const getRoomId = (user1, user2) => {
  return [user1, user2].sort().join("_");
};

getRoomId("userA", "userB"); // This will return userA_userB

// Sender agar person A ha tab bhe xyz room id ho sender agar person B ha tab bhe same xyz room id ho
