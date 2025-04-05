export const formatTime = (date) => {
    // Format time as hh:mm
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}