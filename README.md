This is a [Next.js](https://nextjs.org) project bootstrapped with [`Supabase`].

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Go to `/sync-dashboard' to see the page.

## Packages and Libraries

I used the following packages and libraries:
- [Axios](https://axios-http.com/docs/intro) - to call for APIs
- [Supabase SDK](https://supabase.com/docs/reference/javascript/introduction) - to request anything to Supabase Database
- [Shadcn Components](https://ui.shadcn.com/) - this is for the buttons, table, skeleton, etc.
- [Moment](https://momentjs.com/) - this is for formatting `synced_at` value of a User to a readable Date format

## Architectural and Design pattern

I used the basic hooks for react. I know there are other libraries catering for fetching and mutating such records with advanced hooks to make a dev's life easier but I stick to the rudimentary.

For connecting to Supabase, I used my `SERVICE ROLE` key instead of the `ANON KEY` just to bypass any mutation requirements.

Also, I don't have any migration scripts yet to populate the database. I do it manually on my end by doing these following steps:

1. In your .env file, add the insert the necessary values for these env variables:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`

2. In your Supabase Dashboard, create a `users` table in the `public` schema with the following columns:
    - `id` = uuid, primary
    - `name` = text
    - `email` = text, unique
    - `synced_at` = timestamp, nullable

3. Just create 2 or more records manually and at least 1 of the created records should have a null value to its `synced_at` property in order to test the `sync` button

## Developer Notes

I hope you'll consider my work. Thank you and have a good day!
