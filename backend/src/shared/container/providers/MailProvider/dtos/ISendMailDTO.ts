import IParseTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface ImailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: ImailContact;
  from?: ImailContact;
  subject: string;
  templateData: IParseTemplateDTO;
}
