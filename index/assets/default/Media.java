import java.text.DecimalFormat;

/**
 * @author linfeng
 * @date 2022/4/16
 */
public class Media {
    /**
     *  1200px - 300px
     *  40px-10px
     */
    public static void main(String[] args) {
        double fontSize = 40;
        double fontSizeMin = 10;
        double width = 1200;
        double widthMin = 300;
        double fenshu = 50;

        double widthq = (width - widthMin) / fenshu;
        double fontSizeq = (fontSize - fontSizeMin) / fenshu;
        DecimalFormat df = new DecimalFormat("#.00");

        for(int i = 0;i < fenshu;i ++){
            System.out.println("@media screen and (max-width: " + width + "px) {" +
                    "\n    html {" +
                    "\nfont-size: " + fontSize + "px;" +
                    "\n    }" +
                    "\n}");

            width -= widthq;
            fontSize -= fontSizeq;
            fontSize = Double.parseDouble(df.format(fontSize));
        }
    }
}
