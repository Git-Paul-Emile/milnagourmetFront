import { getContactInfo } from './contactInfoService';

export async function callMilna(): Promise<void> {
  const contactInfo = await getContactInfo();
  const phoneNumber = contactInfo.phone || '+24106610304';
  window.location.href = `tel:${phoneNumber}`;
}