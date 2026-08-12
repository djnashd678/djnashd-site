export function shouldShowSecondaryVenue(eventName: string, venue: string): boolean {
  return eventName.trim().toLocaleLowerCase() !== venue.trim().toLocaleLowerCase();
}
