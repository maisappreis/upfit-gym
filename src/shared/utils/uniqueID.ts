let UUID = 1;

export default function uniqueID () {
  const getID = () => {
    UUID++
    return UUID
  }

  return {
    getID
  }
};
