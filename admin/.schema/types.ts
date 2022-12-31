/* eslint-disable */
export type Schema = {
  '_prisma_migrations': {
    plain: {
      'id': string;
      'checksum': string;
      'finished_at': string;
      'migration_name': string;
      'logs': string;
      'rolled_back_at': string;
      'started_at': string;
      'applied_steps_count': number;
    };
    nested: {};
    flat: {};
  };
  'accounts': {
    plain: {
      'id': string;
      'user_id': string;
      'type': string;
      'provider': string;
      'provider_account_id': string;
      'refresh_token': string;
      'access_token': string;
      'expires_at': number;
      'token_type': string;
      'scope': string;
      'id_token': string;
      'session_state': string;
      'created_at': string;
    };
    nested: {
      'user': Schema['users']['plain'] & Schema['users']['nested'];
    };
    flat: {
      'user:id': string;
      'user:name': string;
      'user:email': string;
      'user:email_verified': string;
      'user:image': string;
      'user:created_at': string;
      'user:updated_at': string;
      'user:profile:id': string;
      'user:profile:created_at': string;
      'user:profile:updated_at': string;
      'user:profile:user_id': string;
      'user:profile:name': string;
      'user:profile:location': string;
      'user:profile:website': string;
      'user:profile:instagram': string;
      'user:profile:roles': Array<string>;
    };
  };
  'books': {
    plain: {
      'id': string;
      'created_at': string;
      'updated_at': string;
      'title': string;
      'subtitle': string;
      'published_on': string;
      'pages': number;
      'cover_url': string;
      'image_urls': Array<string>;
      'publisher_id': string;
    };
    nested: {
      'publisher': Schema['publishers']['plain'] & Schema['publishers']['nested'];
    };
    flat: {
      'publisher:id': string;
      'publisher:created_at': string;
      'publisher:updated_at': string;
      'publisher:name': string;
      'publisher:website': string;
      'publisher:generic_contact': string;
      'publisher:direct_contact': string;
      'publisher:instagram': string;
      'publisher:imprint': string;
      'publisher:logo_url': string;
    };
  };
  'contributions': {
    plain: {
      'id': string;
      'profile_id': string;
      'created_at': string;
      'updated_at': string;
      'job_id': string;
      'book_id': string;
    };
    nested: {
      'profile': Schema['profiles']['plain'] & Schema['profiles']['nested'];
      'job': Schema['jobs']['plain'] & Schema['jobs']['nested'];
      'book': Schema['books']['plain'] & Schema['books']['nested'];
    };
    flat: {
      'profile:id': string;
      'profile:created_at': string;
      'profile:updated_at': string;
      'profile:user_id': string;
      'profile:name': string;
      'profile:location': string;
      'profile:website': string;
      'profile:instagram': string;
      'profile:roles': Array<string>;
      'profile:user:id': string;
      'profile:user:name': string;
      'profile:user:email': string;
      'profile:user:email_verified': string;
      'profile:user:image': string;
      'profile:user:created_at': string;
      'profile:user:updated_at': string;
      'job:id': string;
      'job:created_at': string;
      'job:updated_at': string;
      'job:name': string;
      'book:id': string;
      'book:created_at': string;
      'book:updated_at': string;
      'book:title': string;
      'book:subtitle': string;
      'book:published_on': string;
      'book:pages': number;
      'book:cover_url': string;
      'book:image_urls': Array<string>;
      'book:publisher_id': string;
      'book:publisher:id': string;
      'book:publisher:created_at': string;
      'book:publisher:updated_at': string;
      'book:publisher:name': string;
      'book:publisher:website': string;
      'book:publisher:generic_contact': string;
      'book:publisher:direct_contact': string;
      'book:publisher:instagram': string;
      'book:publisher:imprint': string;
      'book:publisher:logo_url': string;
    };
  };
  'jobs': {
    plain: {
      'id': string;
      'created_at': string;
      'updated_at': string;
      'name': string;
    };
    nested: {};
    flat: {};
  };
  'links': {
    plain: {
      'id': string;
      'book_id': string;
      'created_at': string;
      'updated_at': string;
      'url': string;
      'site': string;
    };
    nested: {
      'book': Schema['books']['plain'] & Schema['books']['nested'];
    };
    flat: {
      'book:id': string;
      'book:created_at': string;
      'book:updated_at': string;
      'book:title': string;
      'book:subtitle': string;
      'book:published_on': string;
      'book:pages': number;
      'book:cover_url': string;
      'book:image_urls': Array<string>;
      'book:publisher_id': string;
      'book:publisher:id': string;
      'book:publisher:created_at': string;
      'book:publisher:updated_at': string;
      'book:publisher:name': string;
      'book:publisher:website': string;
      'book:publisher:generic_contact': string;
      'book:publisher:direct_contact': string;
      'book:publisher:instagram': string;
      'book:publisher:imprint': string;
      'book:publisher:logo_url': string;
    };
  };
  'profiles': {
    plain: {
      'id': string;
      'created_at': string;
      'updated_at': string;
      'user_id': string;
      'name': string;
      'location': string;
      'website': string;
      'instagram': string;
      'roles': Array<string>;
    };
    nested: {
      'user': Schema['users']['plain'] & Schema['users']['nested'];
    };
    flat: {
      'user:id': string;
      'user:name': string;
      'user:email': string;
      'user:email_verified': string;
      'user:image': string;
      'user:created_at': string;
      'user:updated_at': string;
    };
  };
  'publishers': {
    plain: {
      'id': string;
      'created_at': string;
      'updated_at': string;
      'name': string;
      'website': string;
      'generic_contact': string;
      'direct_contact': string;
      'instagram': string;
      'imprint': string;
      'logo_url': string;
    };
    nested: {};
    flat: {};
  };
  'sessions': {
    plain: {
      'id': string;
      'session_token': string;
      'user_id': string;
      'expires': string;
    };
    nested: {
      'user': Schema['users']['plain'] & Schema['users']['nested'];
    };
    flat: {
      'user:id': string;
      'user:name': string;
      'user:email': string;
      'user:email_verified': string;
      'user:image': string;
      'user:created_at': string;
      'user:updated_at': string;
      'user:profile:id': string;
      'user:profile:created_at': string;
      'user:profile:updated_at': string;
      'user:profile:user_id': string;
      'user:profile:name': string;
      'user:profile:location': string;
      'user:profile:website': string;
      'user:profile:instagram': string;
      'user:profile:roles': Array<string>;
    };
  };
  'users': {
    plain: {
      'id': string;
      'name': string;
      'email': string;
      'email_verified': string;
      'image': string;
      'created_at': string;
      'updated_at': string;
    };
    nested: {
      'profile': Schema['profiles']['plain'] & Schema['profiles']['nested'];
    };
    flat: {
      'profile:id': string;
      'profile:created_at': string;
      'profile:updated_at': string;
      'profile:user_id': string;
      'profile:name': string;
      'profile:location': string;
      'profile:website': string;
      'profile:instagram': string;
      'profile:roles': Array<string>;
    };
  };
  'verification_tokens': {
    plain: {
      'identifier': string;
      'token': string;
      'expires': string;
    };
    nested: {};
    flat: {};
  };
};
