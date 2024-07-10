import {
    bigint,
    date,
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    timestamp,
    tinyint,
    varchar
} from "drizzle-orm/mysql-core";
import {primaryKey} from "drizzle-orm/pg-core";

export const user = mysqlTable("user",{
    uid:serial("uid").primaryKey(),
    email:varchar("email",{length:256}).unique().notNull(),
    password:varchar("password",{length:256}).notNull(),
    username:varchar("username",{length:256}).notNull().unique(),
    display_name:varchar("display_name",{length:256}).notNull(),
    user_icon:text("user_icon").default('/discord-mark-white.svg').notNull(),
    dob:date("dob").notNull(),
    status:mysqlEnum('status',["online","offline","Do not Disturb"]).notNull().default("online")
});

export const channel = mysqlTable("channel",{
    cid:serial("cid").primaryKey(),
    name:varchar("name",{length:256}).unique().notNull(),
    date_of_creation:timestamp("date_of_creation").notNull().defaultNow(),
    invite_id:varchar("invite_id",{length:256}).unique().notNull(),
    created_by:bigint('created_by',{mode:"number",unsigned:true}).references(()=>user.uid).notNull(),
    channel_banner:varchar("channel_banner",{length:256}).notNull().default("/discord-logo-white.svg"),
});

export const participant = mysqlTable("participant",{
    pid:serial("pid").primaryKey(),
    uid:bigint("uid",{mode:"number",unsigned:true}).references(()=>user.uid),
    cid:bigint("cid",{mode:"number",unsigned:true}).references(()=>channel.cid),
    auth_lvl:tinyint("auth_lvl").notNull().default(0)
});



export const msg = mysqlTable("msg",{
    mid:serial("mid").primaryKey(),
    uid:bigint("uid",{mode:"number",unsigned:true}).references(()=>user.uid),
    cid:bigint("cid",{mode:"number",unsigned:true}).references(()=>channel.cid),
    text:varchar("text",{length:256}).notNull(),
    send_at:timestamp("send_at").notNull().defaultNow()
});

export const friends = mysqlTable("friends",{
    fid:serial('fid').primaryKey(),
    user:bigint("f1",{mode:"number",unsigned:true}).references(()=>user.uid),
    friend:bigint("f2",{mode:"number",unsigned:true}).references(()=>user.uid),
});

export const direct_msg = mysqlTable("direct_msg",{
    dmid:serial("dmid").primaryKey(),
    uid:bigint("uid",{mode:"number",unsigned:true}).references(()=>user.uid),
    fid:bigint("fid",{mode:"number",unsigned:true}).references(()=>friends.fid),
    text:varchar("text",{length:256}).notNull(),
    send_at:timestamp("send_at").notNull().defaultNow()
});

export const pending_friend_req = mysqlTable("pending_friend_req",{
    from:bigint("from",{mode:"number",unsigned:true}),
    to:bigint("to",{mode:"number",unsigned:true})
},(table)=> {
    return {
        pk:primaryKey({columns:[table.to,table.from]})
    }
});

export const channel_invite = mysqlTable("channel_invite",{
    ciid:serial("ciid").primaryKey(),
    cid:bigint("cid",{mode:"number",unsigned:true}).references(()=>channel.cid),
    to:bigint("to",{mode:"number",unsigned:true}).references(()=>user.uid),
    from:bigint("from",{mode:"number",unsigned:true}).references(()=>user.uid),
});