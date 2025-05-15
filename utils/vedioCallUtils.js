const generateVideoCallLink = () => {
    const roomId = `docontime-${Date.now()}`;
    return `https://meet.jit.si/${roomId}`;
};

module.exports = generateVideoCallLink;