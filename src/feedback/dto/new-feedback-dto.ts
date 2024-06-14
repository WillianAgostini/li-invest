import { ApiProperty } from '@nestjs/swagger';

export class NewFeedbackDto {
  @ApiProperty({
    type: String,
    description: 'Resumo atual do ChatGPT',
  })
  conversation: string;

  @ApiProperty({
    type: String,
    description: 'Descrição do problema ou sugestão de melhoria fornecida pelo usuário',
  })
  userComment: string;

  @ApiProperty({
    type: String,
    description: 'Categoria do feedback gerada pelo ChatGPT com base na descrição em userComment',
  })
  category: string;
}
