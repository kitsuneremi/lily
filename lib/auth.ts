// callbacks: {
//     async jwt({ token, user, session }) {
//         return {
//             ...user,
//             ...token
//         }
//     },
//     async session({ session, token, user }) {
//         // console.log(session, token, user)
//         if (user) {
//             if (!user.image) {
//                 const image = `${fileURL}/api/image?path=-1`
//                 return { ...session, user: { image: image, ...token, ...user } };
//             } else {
//                 return { ...session, user: { ...token, ...user } };
//             }
//         } else {
//             const image = `${fileURL}/api/image?path=-1`
//             return { ...session, user: { image: image, ...token } }
//         }
//     },
//     async signIn({ account, user, credentials, email, profile }) {
//         // console.log(account, user, profile)
//         if (account?.provider === 'github') {
//             if (user.email && user.image) {
//                 await prisma.account.upsert({
//                     where: {
//                         email: user.email
//                     },
//                     create: {
//                         email: user.email,
//                         name: user.name!,
//                         //@ts-ignore
//                         password: profile!.login,
//                         //@ts-ignore
//                         username: profile!.login,
//                         avatarLink: user.image,
//                         streamKey: uuid(),
//                         tagName: makeid()
//                     },
//                     update: {
//                         updatedAt: new Date()
//                     }
//                 })
//                 return true;
//             } else {
//                 return false;
//             }
//         } else if (account?.provider === 'google') {
//             await prisma.account.upsert({
//                 where: {
//                     email: user.email!
//                 },
//                 create: {
//                     email: user.email!,
//                     name: user.name!,
//                     //@ts-ignore
//                     password: profile!.given_name + profile!.family_name,
//                     //@ts-ignore
//                     username: profile!.given_name + profile!.family_name,
//                     avatarLink: user.image!,
//                     streamKey: uuid(),
//                     tagName: makeid()
//                 },
//                 update: {
//                     updatedAt: new Date()
//                 }
//             })
//             return true;
//         } else {
//             return true;
//         }
//     }
// },