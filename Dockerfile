FROM node:slim
WORKDIR /
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV NEXTAUTH_URL=https://rakhib-kadirov-nextjs-dashboard5-348a.twc1.net
ENV NEXTAUTH_SECRET=CHcdN7eWjiAueH2E2VjhRAsGqiXcH8AOvbFq4DTbqTU=
ENV JWT_SECRET=3b8bf2c24ee6418dd3d8a404d7e4cda3cf7b75175e4ec5530b7da0d91b2e0e9773aa3ab4dc9c5b590dde2bc629d5d07ee17a6bfdb2acc6fe92ee8601081daeb8dbb65678309cf14ce0c36ccdfc35018c1de291c03f3edea310ccbf1919c5000f3fbf8c21220e9c5450470a4d0ec774133bd2daccfb6aff56526015aab4ce26b22d7e99b7675c6ae640782fe9dc4f721924a5aba8793fd60b646b7710a841a980830b86c73fa68820d8a3eca2260bc86b4e2ef7dde5a2568d221672bc6ea5797bd639f03a4b464336a6e10a0797bdbd643c80d58fdeb2b495b05c42670a8869260e441ff611b150bb549c67f63846b50eae13c5a5b0d1bcb44b356ee941502668
ENV DATABASE_URL=postgresql://neondb_owner:npg_DOVyM5phxzq3@ep-sparkling-darkness-abnlisj2.eu-west-2.aws.neon.tech/neondb?sslmode=require
ENV POSTGRES_URL=postgres://neondb_owner:npg_DOVyM5phxzq3@ep-sparkling-darkness-abnlisj2-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
ENV NEXT_DISABLE_ESLINT=1
COPY --chown=node:node package.json ./
COPY package.json ./
RUN apt-get update 
RUN apt-get install -y python3 g++ make
RUN pnpm install --ignore-scripts
# RUN pnpm install --production
COPY . .
RUN pnpm prisma generate
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]