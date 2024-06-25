import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class TrackingInterceptor implements NestInterceptor {
  constructor(private trackService: TrackService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const trackId = request.headers['trackId'] || request.params?.trackId || request.body?.trackId;

    const entityTrack = await this.trackService.increment(trackId);

    return next.handle().pipe(
      map((data) => ({
        ...data,
        trackId: entityTrack.id,
      })),
    );
  }
}

export function addTrackIdToResponses(document: OpenAPIObject): OpenAPIObject {
  for (const [, pathObject] of Object.entries(document.paths)) {
    for (const [, operation] of Object.entries(pathObject)) {
      if (operation.responses) {
        for (const [, response] of Object.entries(operation.responses)) {
          const content = response['content'];
          if (content && content['application/json'] && content['application/json'].schema) {
            content['application/json'].schema.properties = {
              ...content['application/json'].schema.properties,
              trackId: {
                type: 'string',
                example: '123',
                description: 'The track ID associated with the request',
              },
            };
          }
        }
      }
    }
  }
  return document;
}

export function addTrackIdToQueryParams(document: OpenAPIObject): OpenAPIObject {
  for (const [, pathObject] of Object.entries(document.paths)) {
    for (const [, operation] of Object.entries(pathObject)) {
      if (!operation.parameters) {
        operation.parameters;
      }

      operation.parameters.push({
        name: 'trackId',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
          example: '123',
          description: 'The track ID associated with the request',
        },
      });
    }
  }
  return document;
}
